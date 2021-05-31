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
  const jobs = [];
  for (let i = 0; i < 60; i += interval) {
    let scheduledFor = new Date(nextTimeframe);
    scheduledFor.setHours(scheduleHour, i, 0, 0);
    scheduledFor = new Date(scheduledFor);
    jobs.push({
      subId: sub.subId,
      apiKey: associatedInstallation.apiKey,
      apiSecret: associatedInstallation.apiSecret,
      scheduledFor,
    });
  }
  await job.addMany(jobs);
};

(async () => {
  await connect(process.env.MONGO_DB_URI);
  const records = await subscription.getAll();
  for (const sub of records) {
    await schedule(sub);
  }
  disconnect();
})();
