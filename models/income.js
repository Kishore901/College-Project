const connection = require("../connection"); // connection file to database
const Sequelize = require("sequelize");
const { DataTypes } = require("sequelize");

const Income = connection.define("income", {
  incomeId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  salary: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  interest: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  dividend: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  rental: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  pocketMoney: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  monthYear: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

console.log(Income);
module.exports = Income;
