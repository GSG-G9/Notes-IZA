const { readFileSync } = require('fs');
const { join } = require('path');

const connection = require('./connection');

const dbBuild = () => {
  const sql = readFileSync(join(__dirname, 'note.sql')).toString();
  return connection.query(sql);
};

module.exports = { dbBuild };
