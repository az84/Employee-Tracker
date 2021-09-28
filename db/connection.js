const mysql = require("mysql2");
require('dotenv').config();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootR00t!1",
  database: "employees"
});

connection.connect(function (err) {
  if (err) throw err;
});

module.exports = connection;
