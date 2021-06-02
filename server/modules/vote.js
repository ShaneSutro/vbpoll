const { Router } = require('express');
const { poll } = require('../../data/model');

const router = Router();

router.post('/reset/all', (req, res) => {
  poll.resetVotes(req.body.pollID)
    .then(() => res.sendStatus(202))
    .catch((err) => res.status(500).send(err));
});

router.post('/:id/:ip', (req, res) => {
  console.log(`Saving vote option '${req.body.option}' for poll ${req.params.id} and user ${req.params.ip}`);
  poll.vote(req.params.id, { ip: req.params.ip, option: req.body.option });
  res.sendStatus(201);
});

router.get('/verify/:id/:ip', async (req, res) => {
  const { id, ip } = req.params;
  const doc = await poll.getById(id);
  if (!id || !ip || !doc) {
    res.sendStatus(301);
  } else {
    const voted = { voted: false };
    for (let i = 0; i < doc.votes.length; i++) {
      if (doc.votes[i].ip === ip) {
        voted.voted = true;
        voted.votedForOption = doc.votes[i].option;
      }
    }
    res.status(200).send(voted);
  }
});

module.exports = router;
