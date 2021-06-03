const { Router } = require('express');
const { nanoid } = require('nanoid');
const { poll } = require('../../data/model');

const router = Router();

router.post('/reset/all', (req, res) => {
  poll.resetVotes(req.body.pollID)
    .then(() => res.sendStatus(202))
    .catch((err) => res.status(500).send(err));
});

router.get('/verify/:id', async (req, res) => {
  const { id } = req.params;
  const cookie = req.cookies[id];
  let user;
  if (cookie) {
    user = cookie.user;
  }
  const doc = await poll.getById(id);
  if (!id || !doc || !cookie) {
    res.status(202).send({ voted: false });
  } else {
    const voted = { voted: false };
    for (let i = 0; i < doc.votes.length; i++) {
      if (doc.votes[i].ip === user) {
        voted.voted = true;
        voted.votedForOption = doc.votes[i].option;
      }
    }
    res.status(200).send(voted);
  }
});

router.post('/:id', (req, res) => {
  console.log('Saving vote...');
  let user = nanoid();
  if (!req.cookies[req.params.id]) {
    res.cookie(req.params.id, { user, choice: req.body.option });
  } else {
    const cookie = req.cookies[req.params.id];
    user = cookie.user;
    res.cookie(req.params.id, { user, choice: req.body.option });
  }
  poll.vote(req.params.id, { ip: user, option: req.body.option });
  res.sendStatus(201);
});

module.exports = router;
