const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Employee = sequelize.define('Employee', {
  employee_id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
  },
  branch_id: {
    type: DataTypes.STRING(36),
    allowNull: false,
  },
  employee_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(128),
    allowNull: true,
  },
  salary: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING(55),
    allowNull: true,
  },
  employee_address: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  birthday: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  photo_url: {
    type: DataTypes.STRING(2048),
    allowNull: true,
  },
  status: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
  },
  employee_email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING(2048),
    allowNull: true,
  },
}, {
  tableName: 'employee',
  timestamps: false,
});

module.exports = Employee;
