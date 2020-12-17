const dbConnection = require('../config/connection');

const deleteNote = (noteID, userID) => {
  const sql = {
    text: 'DELETE FROM notes WHERE id = $1 and userID = $2',
    values: [noteID, userID],
  };
  return dbConnection.query(sql);
};

module.exports = { deleteNote };
