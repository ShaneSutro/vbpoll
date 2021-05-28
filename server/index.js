const app = require('./app');
const { connect } = require('../data/database');

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}

connect(process.env.MONGO_DB_URI)
  .then(() => {
    console.log('👍 Server');
    app.listen(3000);
  });
