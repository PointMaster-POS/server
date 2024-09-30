// models/Customer.js
module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define('Customer', {
      customer_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      customer_name: DataTypes.STRING,
      customer_mail: DataTypes.STRING,
      customer_phone: DataTypes.STRING,
      password: DataTypes.STRING,
    });
    return Customer;
  };
  
  // models/Employee.js
  module.exports = (sequelize, DataTypes) => {
    const Employee = sequelize.define('Employee', {
      employee_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      employee_name: DataTypes.STRING,
      role: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    });
    return Employee;
  };
  