const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "postgres",
  database: "cloudfunc",
  port: 5433
});

module.exports = pool;
