const mysql = require('mysql')


// database connection 
const db = mysql.createConnection({
    host     : process.env.HOST,
    user     : process.env.USER,
    password : process.env.PASSWORD,
    database : process.env.DATABASE
  });

  module.exports = db