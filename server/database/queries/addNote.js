const connection = require('../config/connection');

const addNote = (header, content, userID) => {
  const sql = {
    text: 'INSERT INTO notes (header, content,userID) values($1 ,$2, $3) returning *',
    values: [header, content, userID],
  };
  return connection.query(sql);
};

module.exports = { addNote };
