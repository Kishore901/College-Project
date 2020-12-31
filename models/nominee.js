const connection = require("../connection"); // connection file to database
const Sequelize = require("sequelize");
const { DataTypes } = require("sequelize");
const User = require("./user");

const Nominee = connection.define("nominee", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // userid: {
  //   type: DataTypes.INTEGER
  //   // references: {
  //   //   model: User,
  //   //   key: "userid",
  //   // },
  // },
});
Nominee.removeAttribute("id");
Nominee.removeAttribute("createdAt");
Nominee.removeAttribute("updatedAt");
console.log(Nominee);

module.exports = Nominee;
