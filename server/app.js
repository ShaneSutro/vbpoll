const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('../data/model');
const polls = require('./modules/polls');
const vote = require('./modules/vote');
const subscriptions = require('./modules/subscriptions');
const config = require('./modules/config');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// app.use(express.static(path.resolve(__dirname, '../public')));

app.get('/edit', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.use('/config', config);
app.use('/polls', polls);
app.use('/subscriptions', subscriptions);
app.use('/vote', vote);

app.get('/:poll', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

module.exports = app;
