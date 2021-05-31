const Bree = require('bree');

const bree = new Bree({
  jobs: [
    {
      name: 'scheduler',
      cron: '0 * * * *',
    },
    {
      name: 'run',
      cron: '* * * * *',
    },
  ],
});
console.log('Bree Starting Up');
bree.start();
