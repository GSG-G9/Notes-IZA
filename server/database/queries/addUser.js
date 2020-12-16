const dbConnection = require('../config/connection');

const addUser = (name, email, password, bio) => {
  const sql = {
    text: 'INSERT INTO users (name, email, password, bio) values($1 ,$2, $3, $4) returning *;',
    values: [name, email, password, bio],
  };
  return dbConnection.query(sql);
};

module.exports = { addUser };
