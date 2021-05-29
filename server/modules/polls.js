const { Router } = require('express');
const { create, edit } = require('../../data/model');
const router = Router();

router.post('/new/:id', (req, res) => {
  console.log(`At /polls/new route with id ${req.params.id}`);
  console.log(req.body);
  if (req.body !== {}) {
    create(req.body)
      .then(() => res.sendStatus(201))
      .catch((err) => res.status(500).send(err));
  }
});

module.exports = router;
