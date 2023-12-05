
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const financial_account = sequelize.define('financial_account', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Bank_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bank_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bank_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  name:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  UID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
// financial_account.sync()

module.exports = financial_account;
