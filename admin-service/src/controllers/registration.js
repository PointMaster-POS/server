const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // For password hashing
const { getRedisClient } = require('../config/redisclient');
const db = require('../config/db'); // Assuming this is your database configuration

// Controller for first form submission (business details)
const registerBusiness = asyncHandler(async (req, res) => {
    const {
        business_name,
        business_mail,
        business_url,
        business_hotline,
        business_description,
        business_address,
        logo_location,
        business_hours,
        business_registration_number,
        business_type,
        business_registration_date,
    } = req.body;

    // Validate required fields
    if (!business_name || !business_mail) {
        return res.status(400).json({ message: 'Business name and mail are required' });
    }

    const businessData = {
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
        status: 0,
    };

    const client = getRedisClient();

    // Check if the business already exists in Redis
    const exists = await client.exists(business_mail);
    if (exists) {
        return res.status(400).json({ message: 'Business data already exists' });
    }

    // Store business data in Redis (expires in 1 hour)
    await client.set(business_mail, JSON.stringify(businessData), 'EX', 3600);

    // Create JWT token for identification in second form
    const token = jwt.sign({ business_mail }, process.env.REGISTRATION_SECRET, {
        expiresIn: '1h'
    });

    res.status(200).json({
        token,
        message: 'Business data temporarily saved. Please proceed to the next step.'
    });
});

// Controller for second form submission (owner details)
const submitOwnerDetails = asyncHandler(async (req, res) => {
    const { business_owner_name, business_owner_mail, business_password } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.REGISTRATION_SECRET);
        const business_mail = decoded.business_mail;

        const client = getRedisClient();

        // Retrieve business data from Redis
        const businessData = await client.get(business_mail);
        if (!businessData) {
            return res.status(400).json({ message: 'Business data not found or expired' });
        }

        // Parse business data from Redis
        const parsedBusinessData = JSON.parse(businessData);

        // Ensure business_hours is a valid object
        // let business_hours;
        // try {
        //     business_hours = JSON.stringify(parsedBusinessData.business_hours);
        // } catch (err) {
        //     return res.status(400).json({ message: 'Invalid business_hours format', error: err });
        // }

        // Combine business data and owner data
        const fullBusinessData = {
            ...parsedBusinessData,
            business_owner_name,
            business_owner_mail,
            business_password: await bcrypt.hash(business_password, 10), // Hash the password
            status: 1,
        
        };

        // Insert into the database set data column by column
        db.query('INSERT INTO business SET ?', fullBusinessData, (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Database error', error });
            }

            // Successful registration
            res.status(201).json({ message: 'Business registered successfully', results });

            // Optionally delete Redis key after successful registration
            client.del(business_mail);
        });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token', error });
    }
});

module.exports = { registerBusiness, submitOwnerDetails };
