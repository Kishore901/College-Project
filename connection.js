const Sequelize = require("sequelize");

// finance - database name
// root
// kishubhavi30

const connection = new Sequelize("finance", "root", "kishubhavi30", {
  dialect: "mysql",
});

module.exports = connection;
