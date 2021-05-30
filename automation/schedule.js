const Bree = require('bree');
const { connect, disconnect } = require('../data/database');
const { subscription, installation } = require('../data/model');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const schedule = async (sub) => {
  const interval = sub.updateEveryMinutes;
  const associatedInstallation = await installation.get({ installationId: sub.installationId });
  const jobs = [];
  for (let i = 59; i >= 0; i -= interval) {
    jobs.push({
      subId: sub.subId,
      apiKey: associatedInstallation.apiKey,
      apiSecret: associatedInstallation.apiSecret,
    });
  }
  console.log(jobs.length, 'jobs');
};

(async () => {
  await connect(process.env.MONGO_DB_URI);
  const records = await subscription.getAll();
  for (const sub of records) {
    await schedule(sub);
  };
  disconnect();
})();
