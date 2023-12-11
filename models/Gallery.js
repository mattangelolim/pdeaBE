const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Gallery = sequelize.define('Gallery', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    UID: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Gallery: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    description:{
        type: DataTypes.TEXT,
        allowNull: true,
    }
})

// Gallery.sync()

module.exports = Gallery;