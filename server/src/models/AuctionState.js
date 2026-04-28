const mongoose = require('mongoose');

const auctionStateSchema = new mongoose.Schema(
  {
    singletonKey: { type: String, default: 'main', unique: true },
    currentAssetIndex: { type: Number, default: 0, min: 0 },
    currentAssetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', default: null },
    isRunning: { type: Boolean, default: false },
    auctionEndsAt: { type: Date, default: null },
    durationSeconds: { type: Number, default: 45, min: 10, max: 180 },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AuctionState', auctionStateSchema);
