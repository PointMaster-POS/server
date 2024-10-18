const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const Customer  = require('../models/customer');
// Reset Password for Customer
const resetPasswordCustomer = asyncHandler(async (req, res) => {
    console.log('Reset Password for Customer');
    const { customer_id, password } = req.body;

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Ensure Customer is defined and update password
    if (Customer) {
        const updated = await Customer.update(
            { password: hashedPassword },
            { where: { customer_id } }
        );

        if (updated) {
            // Find the customer after the update
            const customer = await Customer.findOne({ where: { customer_id } });

            // Create access token
            const accessToken = jwt.sign(
                {
                    customer: {
                        customer_name: customer.customer_name,
                        customer_id: customer.customer_id,
                        customer_mail: customer.customer_mail,
                        customer_phone: customer.customer_phone,
                    },
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30m' }
            );

            return res.status(200).json({ message: 'Password reset successful', accessToken });
        } else {
            return res.status(404).json({ message: 'Customer not found' });
        }
    } else {
        return res.status(500).json({ message: 'Customer model not found' });
    }
});

// Reset Password for Employee
const resetPasswordEmployee = asyncHandler(async (req, res) => {
    console.log("upto here --------->");

    const { employee_id, password } = req.body;

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update employee password
    const [updated] = await Employee.update(
        { password: hashedPassword },
        { where: { employee_id } }
    );

    if (updated) {
        // Find the employee after the update
        const employee = await Employee.findOne({ where: { employee_id } });

        // Create access token
        const accessToken = jwt.sign(
            {
                employee: {
                    employee_name: employee.employee_name,
                    employee_id: employee.employee_id,
                    employee_role: employee.role,
                    email: employee.email,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30m' }
        );

        return res.status(200).json({ message: 'Password reset successful', accessToken });
    } else {
        return res.status(404).json({ message: 'Employee not found' });
    }
});

module.exports = { resetPasswordCustomer, resetPasswordEmployee };
