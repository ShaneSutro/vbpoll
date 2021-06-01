const { Router } = require('express');
const { poll } = require('../../data/model');

const router = Router();

router.post('/:id/:ip', (req, res) => {
  console.log(`Saving vote option '${req.body.option}' for poll ${req.params.id} and user ${req.params.ip}`);
  poll.vote(req.params.id, { ip: req.params.ip, option: req.body.option });
  res.sendStatus(201);
});

module.exports = router;
