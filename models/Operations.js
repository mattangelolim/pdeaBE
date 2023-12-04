
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const Operation = sequelize.define('Operation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  document_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  __filename: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  evidence:{
    type: DataTypes.STRING,
    allowNull:true,
  },
  UID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Operation.sync()

module.exports = Operation;
