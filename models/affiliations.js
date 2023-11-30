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
  Picture: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
  },
});

// Affiliation.sync()

module.exports = Affiliation;
