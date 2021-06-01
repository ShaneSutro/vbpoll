const { Router } = require('express');
const { poll } = require('../../data/model');

const router = Router();

router.post('/save', (req, res) => {
  console.log(`At /polls/save route with id ${req.params.id}`);
  console.log(req.body);
  if (req.body !== {}) {
    const pollID = req.body.pollID;
    const pollInformation = req.body.poll;
    poll.create(pollID, pollInformation)
      .then(() => res.sendStatus(201))
      .catch((err) => res.status(500).send(err));
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

module.exports = router;
