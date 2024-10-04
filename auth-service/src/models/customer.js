const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Customer = sequelize.define('Customer', {
  customer_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  customer_name: {
    type: DataTypes.STRING,
  },
  customer_mail: {
    type: DataTypes.STRING,
    unique: true,
  },
  customer_phone: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'customer',
  timestamps: false,
});

module.exports = Customer;
