const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Progressive_Report = sequelize.define("Progressive_Report", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    UID: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    progress: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

})

// Progressive_Report.sync()

module.exports = Progressive_Report;
