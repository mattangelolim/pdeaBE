const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Illegal_Drugs = sequelize.define('Illegal_Drugs', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    UID: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    drug_name: {
        type: DataTypes.STRING,
        allowNull: true,
    }
})

// Illegal_Drugs.sync()

module.exports = Illegal_Drugs;