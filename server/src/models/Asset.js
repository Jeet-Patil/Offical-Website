const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    basePrice: { type: Number, required: true, min: 0 },
    soldTo: { type: String, trim: true, default: '' },
    soldToTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
    isSold: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Asset', assetSchema);
