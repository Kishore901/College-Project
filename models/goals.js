const connection = require("../connection"); // connection file to database
const Sequelize = require("sequelize");
const { DataTypes } = require("sequelize");

const Goals = connection.define("goals", {
  goalId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Htotalsaved: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  // Hpresent: {
  //   type: DataTypes.INTEGER,
  //   defaultValue: 0,
  // },
  Htarget: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  HmonthYear: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Vtotalsaved: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  // Vpresent: {
  //   type: DataTypes.INTEGER,
  //   defaultValue: 0,
  // },
  Vtarget: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  VmonthYear: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Gtotalsaved: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  // Gpresent: {
  //   type: DataTypes.INTEGER,
  //   defaultValue: 0,
  // },
  Gtarget: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  GmonthYear: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

console.log(Goals);

module.exports = Goals;
