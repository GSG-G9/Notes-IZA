const { readFileSync } = require('fs');
const { join } = require('path');

const connection = require('./connection');

const dbBuild = () => {
  const sql = readFileSync(join(__dirname, 'note.sql')).toString();
  return connection.query(sql).then(()=>{
    const fakeData=readFileSync(join(__dirname, 'fakeNote.sql')).toString();
    return connection.query(fakeData)
  })
};

module.exports = { dbBuild };
