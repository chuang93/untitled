var mysql = require('mysql');

var connection = mysql.createConnection({
   supportBigNumbers: true,
   bigNumberStrings: true,
   host: "localhost",
   user: "root",
   password: "huang101063",
   database: "myappdb",
   port: 3306,
});

module.exports = connection;