const { Router } = require('express');
const { poll, subscription } = require('../../data/model');
const { singleReset } = require('../../jobs/reset');

const router = Router();

const frequencyMap = {
  1: 1,
  2: 5,
  3: 10,
  4: 15,
  5: 20,
  6: 30,
  7: 60,
};

router.post('/save', (req, res) => {
  console.log(req.body);
  if (req.body !== {}) {
    const { pollID, metadata, pollData } = req.body;
    poll.create(pollID, metadata, pollData)
      .then(() => res.sendStatus(201))
      .catch((err) => res.status(500).send(err));
  }
});

router.put('/frequency/update', async (req, res) => {
  const { newFrequency, subId } = req.body;
  await subscription.update(subId, frequencyMap[newFrequency]);
  await singleReset(subId);
  res.sendStatus(203);
});

router.get('/find/poll/:pollID', async (req, res) => {
  const existingPoll = await poll.getById(req.params.pollID);
  console.log('Found by id:', existingPoll);
  if (!existingPoll) {
    res.sendStatus(204);
  } else {
    res.status(200).send(existingPoll);
  }
});

router.get('/find/:subscription', async (req, res) => {
  const existingPoll = await poll.getBySub(req.params.subscription);
  if (!existingPoll) {
    res.sendStatus(204);
  } else {
    res.status(200).send(existingPoll);
  }
});

router.post('/update-status', (req, res) => {
  poll.updateStatus(req.body.pollID, req.body.status)
    .then(() => res.sendStatus(200))
    .catch((err) => res.status(500).send(err));
});

module.exports = router;
