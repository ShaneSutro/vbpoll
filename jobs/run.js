const { Worker, isMainThread, workerData } = require('worker_threads');
const fs = require('fs');

const file = './test.txt';
fs.appendFile(file, 'Test', (err) => {
  if (err) {
    return console.log(err);
  }
  return;
});

console.log('Worker data: ', workerData);
