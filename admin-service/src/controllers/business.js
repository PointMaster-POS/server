
const db = require('../config/db'); 
const asyncHandler = require('express-async-handler');

/*
    @desc Update business details
    @route PUT /business/update-business-details
    @access Private (Business Owner)
*/

const updateBusinessDetails = asyncHandler((req, res) => {
    const business_id = req.owner.business_id;

    const {
        business_name,
        business_mail,
        business_url,
        business_hotline,
        business_description,
        business_address,
        logo_location,
        business_registration_number,
        business_type,
        business_registration_date,
    } = req.body;

    if (!business_name || !business_mail) {
        return res.status(400).json({ message: 'Business name and mail are required' });
    }

    const updateBusinessQuery = `UPDATE business SET business_name = ?, business_mail = ?, business_url = ?, business_hotline = ?, business_description = ?, business_address = ?, logo_location = ?, business_registration_number = ?, business_type = ?, business_registration_date = ? WHERE business_id = ?`;

    db.query(updateBusinessQuery, [business_name, business_mail, business_url, business_hotline, business_description, business_address, logo_location, business_registration_number, business_type, business_registration_date, business_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            return res.status(200).json({ message: 'Business details updated successfully' });
        }
    }

);
});
