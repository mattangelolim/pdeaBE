// models/document.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Document = sequelize.define("Document", {
  UID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  documentType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pdfPath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Document.sync();

module.exports = Document;
