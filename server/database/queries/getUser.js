const dbConnection = require('../config/connection');

const getUser = (userID) => {
  const sql = {
    text: `SELECT * FROM notes where userID = ${userID};`,
  };
  return dbConnection.query(sql);
};