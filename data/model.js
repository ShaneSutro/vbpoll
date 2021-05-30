const mongoose = require('mongoose');
const { PollSchema, SubSchema, InstallationSchema } = require('./pollSchema');

const Poll = mongoose.model('Poll', PollSchema);
const Subscription = mongoose.model('Subscription', SubSchema);
const Installation = mongoose.model('Installation', InstallationSchema);

module.exports = {
  poll: {
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
  },
  subscription: {
    add: async (data) => {
      await Subscription.findOneAndUpdate(
        { subId: data.subId },
        data,
        { upsert: true, new: true, runValidators: true },
      )
        .catch((err) => err);
    },
  },
  installation: {
    add: async (data) => {
      await Installation.findOneAndUpdate(
        { installationId: data.installationId },
        data,
        { upsert: true, new: true, runValidators: true },
      )
        .catch((err) => err);
    },
  },
};
