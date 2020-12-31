const connection = require("../connection"); // connection file to database
const Sequelize = require("sequelize");
const { DataTypes } = require("sequelize");

const Totalusers = connection.define("totalusers", {
  users: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});
Totalusers.removeAttribute("id");
Totalusers.removeAttribute("userUserid");
Totalusers.removeAttribute("createdAt");
Totalusers.removeAttribute("updatedAt");
module.exports = Totalusers;
