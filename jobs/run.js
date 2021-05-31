const dotenv = require('dotenv');
const { connect, disconnect } = require('../data/database');
const { job } = require('../data/model');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const runJob = (data) => {
  console.log(data);
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
        console.log('running job', subJob);
        runJob(subJob);
        await removeJob(subJob._id);
      } else {
        console.log('skipping job', subJob);
      }
    }));
  })())
  .then(() => disconnect());
