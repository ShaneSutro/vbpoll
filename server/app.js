const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('../data/model');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// app.use(express.static(path.resolve(__dirname, '../public')));

app.get('/config/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.get('/:poll', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.get('/verify/:id/:ip', (req, res) => {
  const { id, ip } = req.params;
  // TODO: Check against database to see if this ip has voted
  res.send({ voted: false, votedForOption: 'c' });
});

app.post('/vote/:id/:ip', (req, res) => {
  console.log(`Saving vote option '${req.body.option}' for poll ${req.params.id} and user ${req.params.ip}`);
  db.vote(req.params.id, { ip: req.params.id, option: req.body.option });
  res.sendStatus(201);
});

module.exports = app;
