const mongoose = require('mongoose');

const recruitmentSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  mobile: { type: String, required: true, unique: true, trim: true },
  yearOfStudy: { type: String, required: true, trim: true },
  branch: { type: String, required: true, trim: true },
  roles: { type: [String], required: true },
  preferredRole: { type: String, required: true, trim: true },
  secondPreference: { type: String, trim: true, default: '' },
  previousClubExperience: { type: String, trim: true, default: '' },
  leadershipExperience: { type: String, trim: true, default: '' },
  github: { type: String, trim: true, default: '' },
  linkedin: { type: String, trim: true, default: '' },
  portfolioWebsite: { type: String, trim: true, default: '' },
  resumeUrl: { type: String, required: true },
  additionalPortfolioLink: { type: String, trim: true, default: '' },
  whyJoinDesoc: { type: String, trim: true, default: '' },
  status: { type: String, default: 'Pending', trim: true },
  appliedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Recruitment', recruitmentSchema);
