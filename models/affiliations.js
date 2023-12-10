// models/Affiliation.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Assuming you have a separate file for Sequelize configuration

const Affiliation = sequelize.define('Affiliation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Affiliation_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Gender: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Relationship: {
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
  Picture: {
    type: DataTypes.STRING,
    allowNull: true,
  },

});

Affiliation.sync()

module.exports = Affiliation;
