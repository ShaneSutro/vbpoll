const bree = require('./bree');
const { connect, disconnect } = require('../data/database');
const { subscription, installation } = require('../data/model');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const run = async (job) => {
  console.log(job);
};

const schedule = async (sub) => {
  const nextTimeframe = new Date();
  console.log(nextTimeframe);
  nextTimeframe.setHours(nextTimeframe.getHours() + 1);
  const scheduleHour = nextTimeframe.getHours();
  const interval = sub.updateEveryMinutes;
  const associatedInstallation = await installation.get({
    installationId: sub.installationId,
  });
  const job = [{
    name: 'run',
    worker: {
      workerData: {
        subId: sub.subId,
        apiKey: associatedInstallation.apiKey,
        apiSecret: associatedInstallation.apiSecret,
      },
    },
    interval: `${interval}s`,
  }];
  bree.add(job);
  // for (let i = 0; i < 60; i += interval) {
  //   const scheduledFor = new Date(nextTimeframe);
  //   scheduledFor.setHours(scheduleHour, i, 0, 0);
  //   const job = jobScheduler.scheduleJob(scheduledFor, () => {
  //     run.bind({
  //       subId: sub.subId,
  //       apiKey: associatedInstallation.apiKey,
  //       apiSecret: associatedInstallation.apiSecret,
  //       scheduledFor,
  //     });
  //   });
  //   jobs.push(job);
  //   jobs.push({
  //     subId: sub.subId,
  //     apiKey: associatedInstallation.apiKey,
  //     apiSecret: associatedInstallation.apiSecret,
  //     scheduledFor,
  //   });
  // }
  bree.start();
  console.log(job);
};

(async () => {
  await connect(process.env.MONGO_DB_URI);
  const records = await subscription.getAll();
  for (const sub of records) {
    await schedule(sub);
  }
  disconnect();
})();
