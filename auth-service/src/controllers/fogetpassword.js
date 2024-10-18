const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Business = require('../models/business');


const fogetPasswordController = asyncHandler(async (req, res) => {
    const { business_mail, birthday, newPassword } = req.body;
    console.log('Reset Password for Business Owner');
    console.log(req.body);

    // Validate input
    if (!business_mail || !birthday || !newPassword) {
        return res.status(400).json({ message: 'Email, birthday, and new password are required' });
    }

    // Find business by email and birthday
    const business = await Business.findOne({
        where: {
            business_mail: business_mail,
             business_owner_birthday: birthday
        }
    });

    
    console.log(business);

    if (!business) {
        return res.status(404).json({ message: 'No business found with this email and birthday combination' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    await business.update({ business_password: hashedPassword });

    return res.status(200).json({ message: 'Password reset successful' });
});

module.exports = fogetPasswordController;
