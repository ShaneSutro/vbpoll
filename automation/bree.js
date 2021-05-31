const Bree = require('bree');

const listen = () => 0;

const bree = new Bree({
  jobs: [
    {
      name: 'scheduler',
      interval: '60m',
    },
    {
      name: 'run',
      interval: '1m',
    },
  ],
});
console.log('Bree Starting Up');
bree.start();
