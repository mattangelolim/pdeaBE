const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const admin = sequelize.define("admin", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  district:{
    type: DataTypes.STRING,
    allowNull:true
  },
  admin_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
  },
});

// admin.sync();

module.exports = admin;
