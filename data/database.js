const mongoose = require('mongoose');

const connect = (connection) => new Promise((resolve, reject) => {
  mongoose
    .connect(connection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('👍 DB');
      resolve();
    })
    .catch((err) => reject(err));
});

module.exports = {
  connect,
};
