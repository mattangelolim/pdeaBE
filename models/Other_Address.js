const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Other_Address = sequelize.define("Other_Address", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    UID: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Barangay: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    City: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Region: {
        type: DataTypes.STRING,
        allowNull: true,
    }
})

// Other_Address.sync()

module.exports = Other_Address;
