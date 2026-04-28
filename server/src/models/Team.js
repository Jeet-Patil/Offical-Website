const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    fileUrl: { type: String, trim: true },
    figmaLink: { type: String, trim: true },
    submittedAt: { type: Date },
  },
  { _id: false }
);

const teamSchema = new mongoose.Schema(
  {
    teamName: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    coins: { type: Number, default: 1000, min: 0 },
    assets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Asset' }],
    submission: { type: submissionSchema, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Team', teamSchema);
