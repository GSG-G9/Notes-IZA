const dbConnection=require('../config/connection')

module.exports= getNotes = () => {
  const sql = {
    text: "SELECT * FROM notes;",
  };
  return dbConnection.query(sql);
};
