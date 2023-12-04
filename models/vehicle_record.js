// models/Vehicle_Record.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const Vehicle_Record = sequelize.define('Vehicle_Record', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Vehicle_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  plate_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  registered_address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  registered_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  UID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Vehicle_Record.sync()

module.exports = Vehicle_Record;
