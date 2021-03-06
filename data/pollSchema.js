const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema({
  pollID: String,
  subId: String,
  voteCounts: {
    totalVotes: Number,
    a: Number,
    b: Number,
    c: Number,
  },
  poll: {
    allowUnlimitedVotes: String,
    isOpen: Boolean,
    question: String,
    a: String,
    b: String,
    c: String,
    openAsOf: String,
    openUntil: String,
    frequency: String,
  },
  votes: [{
    ip: String,
    option: String,
  }],
}, { timestamps: true });

const SubSchema = new mongoose.Schema({
  subId: String,
  installationId: String,
  updateEveryMinutes: Number,
  activePoll: String,
  previousPolls: [String],
}, { timestamps: true });

const InstallationSchema = new mongoose.Schema({
  installationId: String,
  apiKey: String,
  apiSecret: String,
  installableId: String,
}, { timestamps: true });

const JobSchema = new mongoose.Schema({
  scheduledFor: Date,
  subId: String,
  apiKey: String,
  apiSecret: String,
  installableId: String,
});

module.exports = {
  PollSchema,
  SubSchema,
  InstallationSchema,
  JobSchema,
};
