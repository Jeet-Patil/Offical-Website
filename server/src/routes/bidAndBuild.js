const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const Registration = require('../models/Registration');
const Team = require('../models/Team');
const Asset = require('../models/Asset');
const Bid = require('../models/Bid');
const AuctionState = require('../models/AuctionState');

const router = express.Router();

const DEFAULT_ASSETS = [
  { name: 'Premium UI Kit', basePrice: 120 },
  { name: 'Icon Pack Pro', basePrice: 80 },
  { name: 'Typography Bundle', basePrice: 70 },
  { name: 'Stock Image Vault', basePrice: 110 },
  { name: 'Animation Pack', basePrice: 90 },
  { name: 'Wireframe Library', basePrice: 60 },
  { name: 'Brand Color Palette', basePrice: 75 },
];

const submissionUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, and PDF files are allowed'));
    }
  },
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const toObjectIdString = (id) => String(id || '');
const isAuctionEvent = (eventName) => String(eventName || '').trim().toLowerCase() === 'bid & build'.toLowerCase();

const uploadSubmission = (buffer, mimetype) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'genesis/bid-and-build-submissions',
        resource_type: mimetype === 'application/pdf' ? 'raw' : 'image',
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });

const ensureAssets = async () => {
  const count = await Asset.countDocuments();
  if (count > 0) return;
  await Asset.insertMany(DEFAULT_ASSETS);
};

const getState = async () => {
  let state = await AuctionState.findOne({ singletonKey: 'main' });
  if (!state) {
    state = await AuctionState.create({ singletonKey: 'main' });
  }
  return state;
};

const resolveCurrentAsset = async (state) => {
  const unsoldAssets = await Asset.find({ isSold: false }).sort({ createdAt: 1, _id: 1 });
  if (!unsoldAssets.length) {
    state.currentAssetId = null;
    state.isRunning = false;
    state.completed = true;
    state.auctionEndsAt = null;
    await state.save();
    return null;
  }

  if (state.currentAssetId) {
    const existing = unsoldAssets.find((a) => toObjectIdString(a._id) === toObjectIdString(state.currentAssetId));
    if (existing) return existing;
  }

  const idx = Math.min(state.currentAssetIndex || 0, unsoldAssets.length - 1);
  const nextAsset = unsoldAssets[idx];
  state.currentAssetId = nextAsset._id;
  await state.save();
  return nextAsset;
};

const getHighestBidForAsset = async (assetId) =>
  Bid.findOne({ assetId }).sort({ amount: -1, createdAt: 1 }).populate('teamId', 'teamName email');

const assignWinnerForAsset = async (assetId) => {
  const asset = await Asset.findById(assetId);
  if (!asset || asset.isSold) return null;

  const highestBid = await getHighestBidForAsset(asset._id);
  if (!highestBid) {
    asset.isSold = true;
    await asset.save();
    return { asset, winner: null, amount: null };
  }

  const winningTeam = await Team.findById(highestBid.teamId);
  if (!winningTeam) {
    asset.isSold = true;
    await asset.save();
    return { asset, winner: null, amount: null };
  }

  winningTeam.coins = Math.max(0, winningTeam.coins - highestBid.amount);
  winningTeam.assets.push(asset._id);
  await winningTeam.save();

  asset.isSold = true;
  asset.soldTo = winningTeam.teamName;
  asset.soldToTeam = winningTeam._id;
  await asset.save();

  return {
    asset,
    winner: { id: winningTeam._id, teamName: winningTeam.teamName },
    amount: highestBid.amount,
  };
};

const moveToNextAsset = async (state) => {
  state.currentAssetIndex = (state.currentAssetIndex || 0) + 1;

  const unsoldAssets = await Asset.find({ isSold: false }).sort({ createdAt: 1, _id: 1 });
  if (!unsoldAssets.length) {
    state.currentAssetId = null;
    state.isRunning = false;
    state.completed = true;
    state.auctionEndsAt = null;
    await state.save();
    return null;
  }

  const index = Math.min(state.currentAssetIndex, unsoldAssets.length - 1);
  const next = unsoldAssets[index];
  state.currentAssetId = next._id;
  state.isRunning = true;
  state.completed = false;
  state.auctionEndsAt = new Date(Date.now() + state.durationSeconds * 1000);
  await state.save();
  return next;
};

const maybeCloseExpiredAuction = async () => {
  const state = await getState();
  if (!state.isRunning || !state.auctionEndsAt) return;
  if (state.auctionEndsAt.getTime() > Date.now()) return;

  const currentAsset = await resolveCurrentAsset(state);
  if (!currentAsset) return;

  await assignWinnerForAsset(currentAsset._id);
  await moveToNextAsset(state);
};

const adminGuard = (req, res, next) => {
  const expected = process.env.BID_BUILD_ADMIN_KEY;
  if (!expected) return next();
  const provided = req.headers['x-admin-key'];
  if (provided !== expected) {
    return res.status(401).json({ success: false, error: 'Unauthorized admin action' });
  }
  return next();
};

router.use(async (_req, _res, next) => {
  try {
    await ensureAssets();
    await maybeCloseExpiredAuction();
    next();
  } catch (err) {
    next(err);
  }
});

router.post('/team/validate', async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const teamName = String(req.body?.teamName || '').trim();

    if (!email && !teamName) {
      return res.status(400).json({ success: false, error: 'Provide email or team name to validate access.' });
    }

    const registration = await Registration.findOne({
      event: { $regex: /^bid\s*&\s*build$/i },
      $or: [
        ...(email ? [{ email }] : []),
        ...(teamName ? [{ teamName: { $regex: new RegExp(`^${teamName}$`, 'i') } }] : []),
      ],
    });

    if (!registration || !isAuctionEvent(registration.event)) {
      return res.status(403).json({ success: false, error: 'Team not registered for Bid & Build.' });
    }

    let team = await Team.findOne({ email: registration.email.toLowerCase() });
    if (!team) {
      team = await Team.create({
        teamName: registration.teamName,
        email: registration.email.toLowerCase(),
        coins: 1000,
        assets: [],
      });
    }

    const populatedTeam = await Team.findById(team._id).populate('assets', 'name basePrice soldTo');

    return res.json({
      success: true,
      team: {
        id: populatedTeam._id,
        teamName: populatedTeam.teamName,
        email: populatedTeam.email,
        coins: populatedTeam.coins,
        assets: populatedTeam.assets,
        submission: populatedTeam.submission || {},
      },
    });
  } catch (err) {
    console.error('Team validate error:', err);
    return res.status(500).json({ success: false, error: 'Could not validate team' });
  }
});

router.get('/team/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('assets', 'name basePrice soldTo');
    if (!team) return res.status(404).json({ success: false, error: 'Team not found' });

    return res.json({
      success: true,
      team: {
        id: team._id,
        teamName: team.teamName,
        email: team.email,
        coins: team.coins,
        assets: team.assets,
        submission: team.submission || {},
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch team state' });
  }
});

router.get('/current-auction', async (_req, res) => {
  try {
    const state = await getState();
    const currentAsset = await resolveCurrentAsset(state);

    if (!currentAsset) {
      return res.json({ success: true, completed: true, currentAuction: null });
    }

    const highestBid = await getHighestBidForAsset(currentAsset._id);
    const remainingMs = state.auctionEndsAt ? Math.max(0, state.auctionEndsAt.getTime() - Date.now()) : 0;

    return res.json({
      success: true,
      completed: !!state.completed,
      currentAuction: {
        assetId: currentAsset._id,
        assetName: currentAsset.name,
        basePrice: currentAsset.basePrice,
        isRunning: !!state.isRunning,
        durationSeconds: state.durationSeconds,
        auctionEndsAt: state.auctionEndsAt,
        remainingMs,
        highestBid: highestBid
          ? {
              amount: highestBid.amount,
              teamId: highestBid.teamId?._id,
              teamName: highestBid.teamId?.teamName,
            }
          : null,
      },
    });
  } catch (err) {
    console.error('Current auction error:', err);
    return res.status(500).json({ success: false, error: 'Failed to load current auction' });
  }
});

router.post('/bid', async (req, res) => {
  try {
    const { teamId, assetId, amount } = req.body || {};
    const parsedAmount = Number(amount);

    if (!teamId || !assetId || Number.isNaN(parsedAmount)) {
      return res.status(400).json({ success: false, error: 'teamId, assetId and amount are required' });
    }

    const [team, asset, state] = await Promise.all([
      Team.findById(teamId),
      Asset.findById(assetId),
      getState(),
    ]);

    if (!team) return res.status(404).json({ success: false, error: 'Team not found' });
    if (!asset) return res.status(404).json({ success: false, error: 'Asset not found' });
    if (!state.isRunning) return res.status(400).json({ success: false, error: 'Auction is not running' });
    if (!state.currentAssetId || toObjectIdString(state.currentAssetId) !== toObjectIdString(asset._id)) {
      return res.status(400).json({ success: false, error: 'Bidding is closed for this asset' });
    }

    const highestBid = await getHighestBidForAsset(asset._id);
    const minimumRequired = highestBid ? highestBid.amount + 1 : asset.basePrice;

    if (parsedAmount < minimumRequired) {
      return res.status(400).json({
        success: false,
        error: `Bid must be greater than current highest bid (${minimumRequired - 1}).`,
      });
    }

    if (parsedAmount > team.coins) {
      return res.status(400).json({ success: false, error: 'Insufficient coins for this bid.' });
    }

    const bid = await Bid.create({ teamId: team._id, assetId: asset._id, amount: parsedAmount });

    return res.status(201).json({
      success: true,
      bid: {
        id: bid._id,
        teamId: team._id,
        amount: bid.amount,
      },
    });
  } catch (err) {
    console.error('Bid placement error:', err);
    return res.status(500).json({ success: false, error: 'Failed to place bid' });
  }
});

router.post('/assign-asset', adminGuard, async (req, res) => {
  try {
    const targetAssetId = req.body?.assetId;
    const state = await getState();

    const targetAsset = targetAssetId
      ? await Asset.findById(targetAssetId)
      : await resolveCurrentAsset(state);

    if (!targetAsset) {
      return res.status(404).json({ success: false, error: 'No auction asset available to assign' });
    }

    const result = await assignWinnerForAsset(targetAsset._id);

    if (state.currentAssetId && toObjectIdString(state.currentAssetId) === toObjectIdString(targetAsset._id)) {
      await moveToNextAsset(state);
    }

    return res.json({
      success: true,
      assignment: {
        assetId: targetAsset._id,
        assetName: targetAsset.name,
        winner: result?.winner || null,
        amount: result?.amount || null,
      },
    });
  } catch (err) {
    console.error('Assign asset error:', err);
    return res.status(500).json({ success: false, error: 'Failed to assign auction asset' });
  }
});

router.post('/team/:id/submission', (req, res) => {
  submissionUpload.single('submissionFile')(req, res, async (uploadErr) => {
    if (uploadErr) {
      return res.status(400).json({ success: false, error: uploadErr.message });
    }

    try {
      const team = await Team.findById(req.params.id);
      if (!team) return res.status(404).json({ success: false, error: 'Team not found' });

      const figmaLink = String(req.body?.figmaLink || '').trim();
      const file = req.file;

      if (!figmaLink && !file) {
        return res.status(400).json({ success: false, error: 'Provide a file upload or a Figma link.' });
      }

      let fileUrl = team.submission?.fileUrl || '';
      if (file) {
        fileUrl = await uploadSubmission(file.buffer, file.mimetype);
      }

      team.submission = {
        fileUrl,
        figmaLink,
        submittedAt: new Date(),
      };
      await team.save();

      return res.json({ success: true, submission: team.submission });
    } catch (err) {
      console.error('Submission error:', err);
      return res.status(500).json({ success: false, error: 'Failed to submit design' });
    }
  });
});

router.post('/auction/start', adminGuard, async (req, res) => {
  try {
    const durationSeconds = Number(req.body?.durationSeconds || 45);
    const clamped = Math.max(30, Math.min(durationSeconds, 60));

    const state = await getState();
    state.durationSeconds = clamped;
    state.isRunning = true;
    state.completed = false;

    const currentAsset = await resolveCurrentAsset(state);
    if (!currentAsset) {
      state.isRunning = false;
      await state.save();
      return res.status(400).json({ success: false, error: 'No assets available to auction.' });
    }

    state.auctionEndsAt = new Date(Date.now() + clamped * 1000);
    state.currentAssetId = currentAsset._id;
    await state.save();

    return res.json({
      success: true,
      auction: {
        assetId: currentAsset._id,
        assetName: currentAsset.name,
        durationSeconds: clamped,
        auctionEndsAt: state.auctionEndsAt,
      },
    });
  } catch (err) {
    console.error('Start auction error:', err);
    return res.status(500).json({ success: false, error: 'Failed to start auction' });
  }
});

router.post('/auction/next', adminGuard, async (_req, res) => {
  try {
    const state = await getState();
    const currentAsset = await resolveCurrentAsset(state);

    if (currentAsset && !currentAsset.isSold) {
      await assignWinnerForAsset(currentAsset._id);
    }

    const nextAsset = await moveToNextAsset(state);

    if (!nextAsset) {
      return res.json({ success: true, completed: true, nextAuction: null });
    }

    return res.json({
      success: true,
      completed: false,
      nextAuction: {
        assetId: nextAsset._id,
        assetName: nextAsset.name,
        basePrice: nextAsset.basePrice,
        endsAt: state.auctionEndsAt,
      },
    });
  } catch (err) {
    console.error('Next auction error:', err);
    return res.status(500).json({ success: false, error: 'Failed to move auction forward' });
  }
});

router.get('/admin/teams', adminGuard, async (_req, res) => {
  try {
    const teams = await Team.find().populate('assets', 'name basePrice soldTo').sort({ teamName: 1 });
    return res.json({
      success: true,
      teams: teams.map((team) => ({
        id: team._id,
        teamName: team.teamName,
        email: team.email,
        coins: team.coins,
        assets: team.assets,
        submission: team.submission,
      })),
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to load teams' });
  }
});

router.post('/admin/team', adminGuard, async (req, res) => {
  try {
    const teamName = String(req.body?.teamName || '').trim();
    const email = String(req.body?.email || '').trim().toLowerCase();
    const requestedCoins = Number(req.body?.coins);
    const coins = Number.isFinite(requestedCoins) ? Math.max(0, Math.floor(requestedCoins)) : 1000;

    if (!teamName || !email) {
      return res.status(400).json({ success: false, error: 'teamName and email are required' });
    }

    const existingByEmail = await Team.findOne({ email });
    if (existingByEmail) {
      return res.status(409).json({ success: false, error: 'A team with this email already exists' });
    }

    const existingByName = await Team.findOne({ teamName: { $regex: new RegExp(`^${teamName}$`, 'i') } });
    if (existingByName) {
      return res.status(409).json({ success: false, error: 'A team with this name already exists' });
    }

    const team = await Team.create({
      teamName,
      email,
      coins,
      assets: [],
    });

    return res.status(201).json({
      success: true,
      team: {
        id: team._id,
        teamName: team.teamName,
        email: team.email,
        coins: team.coins,
        assets: [],
        submission: team.submission || {},
      },
    });
  } catch (err) {
    console.error('Admin team create error:', err);
    return res.status(500).json({ success: false, error: 'Failed to create team' });
  }
});

module.exports = router;
