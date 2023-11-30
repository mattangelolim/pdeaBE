const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Drug_Personality = sequelize.define("Drug_Personality", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UID: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  district:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Birthdate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Gender: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Civil_Status: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Picture: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Affiliation_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Vehicle_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Bank_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Drug_Personality.sync();

module.exports = Drug_Personality;
