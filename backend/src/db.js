const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: parseInt(process.env.DB_PORT || "3306", 10),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "admin",
  database: process.env.DB_NAME || "usac_reviews",
  connectionLimit: 10,
  namedPlaceholders: true,
  waitForConnections: true,
});

module.exports = { pool };