const dotenv = require('dotenv');
const { connect, disconnect } = require('../data/database');
const { job } = require('../data/model');
const runner = require('./runners');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const runJob = async (data) => {
  await runner[data.installableId](data);
};

const removeJob = async (docId) => {
  await job.delete(docId);
};

connect(process.env.MONGO_DB_URI)
  .then(() => (async () => {
    const now = new Date();
    const allJobs = await job.getAll();
    await Promise.all(allJobs.map(async (subJob) => {
      if (now > subJob.scheduledFor) {
        // Run and remove
        await runJob(subJob);
        // eslint-disable-next-line no-underscore-dangle
        await removeJob(subJob._id);
      }
    }));
  })())
  .then(() => disconnect());
