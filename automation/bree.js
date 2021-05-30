const Bree = require('bree');

const listen = () => 0;

const bree = new Bree({
  jobs: [
    {
      name: 'listener',
      path: listen,
      interval: '60m',
    },
  ],
});
console.log('listening...');
bree.start();

module.exports = bree;
console.log('exported');
