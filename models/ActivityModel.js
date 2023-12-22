const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Activity = sequelize.define("Activity", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  UID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

// Activity.sync();

module.exports = Activity;
