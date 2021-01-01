const Sequelize = require("sequelize");
const env = require("dotenv").config();
// finance - database name
// root
// kishubhavi30
console.log(process.env.DB_NAME, process.env.USERNAME_DB, process.env.PASSWORD);

const connection = new Sequelize(
  process.env.DB_NAME,
  process.env.USERNAME_DB,
  process.env.PASSWORD,
  {
    dialect: "mysql",
    host: process.env.HOST || "",
  }
);

module.exports = connection;
