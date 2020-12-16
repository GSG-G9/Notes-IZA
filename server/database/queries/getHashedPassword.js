const dbConnection = require('../config/connection');

const getHashedPassword = (email) => {
  const sql = {
    text: 'SELECT password FROM users where email = $1 ;',
    values: [email],
  };
  return dbConnection.query(sql);
};

module.exports = { getHashedPassword };
