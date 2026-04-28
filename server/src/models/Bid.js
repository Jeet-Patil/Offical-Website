const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema(
  {
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
    amount: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

bidSchema.index({ assetId: 1, amount: -1, createdAt: -1 });

module.exports = mongoose.model('Bid', bidSchema);
