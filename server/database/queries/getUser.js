const dbConnection = require('../config/connection');

const getUser = (email, password) => {
  const sql = {
    text: 'SELECT * FROM users where email = $1 and password = $2 ;',
    values: [email, password],
  };
  return dbConnection.query(sql);
};

module.exports = { getUser };
