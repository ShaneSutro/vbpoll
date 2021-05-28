const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.resolve(__dirname, '../public')));

app.get('/config', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.get('/:poll', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'vote.html'));
});

module.exports = app;
