const { Router } = require('express');
const { subscription, installation } = require('../../data/model');
const reset = require('../../jobs/reset');

const router = Router();

const saveInstallation = (data) => new Promise((resolve, reject) => {
  installation.add(data)
    .then(() => resolve())
    .catch((err) => reject(err));
});

const saveSubscription = (data) => new Promise((resolve, reject) => {
  subscription.add(data)
    .then(() => reset.singleReset(data.subId))
    .then(() => resolve())
    .catch((err) => reject(err));
});

router.post('/', async (req, res) => {
  console.log('Config request type:', req.body.type);
  const requestType = req.body.type;
  if (!requestType) { res.sendStatus(400); }
  if (requestType === 'InstallationCreated') {
    const saveToDb = {
      installationId: req.body.installation.id,
      apiKey: req.body.installation.apiCredential.key,
      apiSecret: req.body.installation.apiCredential.secret,
      installableId: req.body.installation.installable.id,
    };
    await saveInstallation(saveToDb)
      .then(() => res.sendStatus(204))
      .catch((err) => res.status(500).send(err));
  } else if (requestType === 'SubscriptionCreated') {
    const saveToDb = {
      subId: req.body.subscription.id,
      updateEveryMinutes: 5,
      installationId: req.body.subscription.installation.id,
      activePoll: 'none',
      previousPolls: [],
    };
    await saveSubscription(saveToDb)
      .then(() => res.sendStatus(204))
      .catch((err) => res.status(500).send(err));
  }
});

module.exports = router;
