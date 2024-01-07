
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Relative = sequelize.define('Relative', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Relationship: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Relative.sync()


module.exports = Relative;
