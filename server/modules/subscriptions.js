const { Router } = require('express');
const { subscription } = require('../../data/model');

const router = Router();

router.post('/new/:subId', (req, res) => {
  if (req.params.subId !== undefined) {
    subscription.createNew(req.params.subId)
      .then(() => res.sendStatus(201))
      .catch((err) => res.status(500).send(err));
  }
});

module.exports = router;
