const mongoose = require('mongoose');
const PollSchema = require('./pollSchema');

const Poll = mongoose.model('Poll', PollSchema);

module.exports = {
  new: async (poll) => {
    await Poll.createOne(poll);
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
};
