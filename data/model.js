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
    create: async (poll) => {
      await Poll.findOneAndUpdate(
        { pollID: poll.pollID },
        poll,
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
    getAll: () => new Promise((resolve, reject) => {
      Subscription.find({})
        .then((records) => resolve(records))
        .catch((err) => reject(err));
    }),
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
    scrubSubscription: (subID) => new Promise((resolve, reject) => {
      Job.deleteMany({ subID })
        .then(() => resolve())
        .catch((err) => reject(err));
    }),
  },
};
