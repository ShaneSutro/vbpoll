const { Router } = require('express');
const { poll } = require('../../data/model');

const router = Router();

router.post('/new/:id', (req, res) => {
  console.log(`At /polls/new route with id ${req.params.id}`);
  console.log(req.body);
  if (req.body !== {}) {
    poll.create(req.body)
      .then(() => res.sendStatus(201))
      .catch((err) => res.status(500).send(err));
  }
});

router.get('/find/:subscription', (req, res) => {

});

module.exports = router;
