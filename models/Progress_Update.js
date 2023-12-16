const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProgressUpdate = sequelize.define("ProgressUpdate", {
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
  field: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// ProgressUpdate.sync();

module.exports = ProgressUpdate;
