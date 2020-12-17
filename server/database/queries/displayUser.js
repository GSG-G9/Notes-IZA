const dbConnection = require('../config/connection');

const displayUser = (id) => {
  const sql = {
    text: 'SELECT * FROM users where id = $1 ;',
    values: [id],
  };
  return dbConnection.query(sql);
};

module.exports = { displayUser };
