const mongoose = require('mongoose');
const PollSchema = require('./pollSchema');

const Poll = mongoose.model('Poll', PollSchema);

module.exports = {
  create: async (poll) => {
    await Poll.findOneAndUpdate(
      { pollID: poll.pollID },
      poll,
      { upsert: true, new: true, runValidators: true },
    );
  },
  get: (pollID) => new Promise((resolve, reject) => {
    Poll.findOne({ pollID })
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  }),
  vote: (pollID, user) => new Promise(async (resolve, reject) => {
    const pollData = await Poll.findOne({ pollID });
    console.log(user, pollData);
  }),
  edit: (pollID, data) => new Promise(async (resolve, reject) => {
    // TODO: implement route
  }),
};
