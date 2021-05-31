const { connect, disconnect } = require('../data/database');
const { subscription, installation, job } = require('../data/model');

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}

const schedule = async (sub) => {
  const nextTimeframe = new Date();
  nextTimeframe.setHours(nextTimeframe.getHours() + 1);
  const scheduleHour = nextTimeframe.getHours();
  const interval = sub.updateEveryMinutes;
  const associatedInstallation = await installation.get({
    installationId: sub.installationId,
  });
  const subJobs = [];
  for (let i = 0; i < 60; i += interval) {
    let scheduledFor = new Date(nextTimeframe);
    scheduledFor.setHours(scheduleHour, i, 0, 0);
    scheduledFor = new Date(scheduledFor);
    try {
      subJobs.push({
        installableId: associatedInstallation.installableId,
        subId: sub.subId,
        apiKey: associatedInstallation.apiKey,
        apiSecret: associatedInstallation.apiSecret,
        scheduledFor,
      });
    } catch (error) {
      console.log(error);
    }
  }
  return subJobs;
};

(async () => {
  await connect(process.env.MONGO_DB_URI);
  const records = await subscription.getAll();
  let jobs = [];
  await Promise.all(records.map(async (sub) => {
    jobs = jobs.concat(await schedule(sub));
  }));
  await job.addMany(jobs);
  disconnect();
})();
