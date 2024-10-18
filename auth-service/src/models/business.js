const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Business = sequelize.define('Business', {
  business_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  business_name: {
    type: DataTypes.STRING,
  },
  business_owner_mail: {
    type: DataTypes.STRING,
    unique: true,

  },
  business_mail: {
    type: DataTypes.STRING,
    unique: true,
  },
  business_owner_birthday: {
    type: DataTypes.DATE, 
  },
  business_password: {
    type: DataTypes.STRING(2048), 
  },
}, {
  tableName: 'business',
  timestamps: false,
});

module.exports = Business;
