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
  First_Name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Middle_Name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Last_Name: {
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
  Barangay: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  City: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Region: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Gender: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Nationality:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  Civil_Status: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Classification:{
    type: DataTypes.STRING,
    allowNull:true,
  },
  Classification_Rating:{
    type:DataTypes.INTEGER,
    allowNull:true
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
