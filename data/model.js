const mongoose = require('mongoose');
const {
  PollSchema,
  SubSchema,
  InstallationSchema,
  JobSchema,
} = require('./pollSchema');

const Poll = mongoose.model('Poll', PollSchema);
const Subscription = mongoose.model('Subscription', SubSchema);
const Installation = mongoose.model('Installation', InstallationSchema);
const Job = mongoose.model('Job', JobSchema);

module.exports = {
  poll: {
    create: async (pollID, metadata, poll) => {
      await Poll.findOneAndUpdate(
        { pollID },
        { ...metadata, poll },
        { upsert: true, new: true, runValidators: true },
      );
    },
    getById: (pollID) => new Promise((resolve, reject) => {
      Poll.findOne({ pollID })
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    }),
    getBySub: (subId) => new Promise((resolve, reject) => {
      Poll.findOne({ subId })
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    }),
    vote: (pollID, user) => new Promise(async (resolve, reject) => {
      const pollData = await Poll.findOne({ pollID });
      const { votes, voteCounts } = pollData;
      let alreadyVoted = false;
      let voteIndex = 0;
      for (let i = 0; i < votes.length; i++) {
        if (votes[i].ip === user.ip) {
          alreadyVoted = true;
          voteIndex = i;
          break;
        }
      }
      if (!alreadyVoted) {
        votes.push(user);
        voteCounts.totalVotes += 1;
        voteCounts[user.option] += 1;
      } else {
        voteCounts[votes[voteIndex].option] -= 1;
        votes[voteIndex].option = user.option;
        voteCounts[user.option] += 1;
      }
      await Poll.findOneAndUpdate({ pollID }, { votes, voteCounts });
    }),
    edit: async (pollID, poll) => {
      await Poll.findOneAndUpdate(
        { pollID },
        { poll },
        { upsert: true, new: true, runValidators: true },
      );
    },
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
    getAll: () => new Promise((resolve, reject) => {
      Subscription.find({})
        .then((records) => resolve(records))
        .catch((err) => reject(err));
    }),
    getOne: (subId) => new Promise((resolve, reject) => {
      Subscription.findOne({ subId })
        .then((doc) => resolve(doc))
        .catch((err) => reject(err));
    }),
    update: async (subId, frequency) => {
      await Subscription.findOneAndUpdate(
        { subId },
        { updateEveryMinutes: frequency },
      );
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
    get: async (search) => new Promise((resolve, reject) => {
      Installation.findOne(search)
        .then((record) => resolve(record))
        .catch((err) => reject(err));
    }),
  },
  job: {
    addMany: (allJobs) => new Promise((resolve, reject) => {
      Job.insertMany(allJobs)
        .then(() => resolve())
        .catch((err) => reject(err));
    }),
    getAll: () => new Promise((resolve, reject) => {
      Job.find({})
        .then((docs) => resolve(docs))
        .catch((err) => reject(err));
    }),
    delete: (_id) => new Promise((resolve, reject) => {
      Job.deleteOne({ _id })
        .then(() => resolve())
        .catch((err) => reject(err));
    }),
    deleteAll: () => new Promise((resolve, reject) => {
      Job.deleteMany({})
        .then(() => resolve())
        .catch((err) => reject(err));
    }),
    scrubSubscription: (subId) => new Promise((resolve, reject) => {
      Job.deleteMany({ subId })
        .then(() => resolve())
        .catch((err) => reject(err));
    }),
  },
};
