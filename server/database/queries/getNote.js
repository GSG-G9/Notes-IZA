const dbConnection = require('../config/connection');

const getNotes = (userID) => {
  const sql = {
    text: `SELECT * FROM notes where userID = ${userID};`,
  };
  return dbConnection.query(sql);
};
module.exports = { getNotes };
