const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  pollID: String,
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
    votedFor: String,
  }],
});
