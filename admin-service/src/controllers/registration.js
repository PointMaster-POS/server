const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const redis = require('redis');
const client = redis.createClient(); 

// controllers for first submission from (business details)
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

    // Validate input
    if (!business_name || !business_mail) {
        return res.status(400).json({ message: 'Business name and mail are required' });
    }

    // Create an object to store business data in Redis
    const businessData = {
        business_name : business_name,
        business_mail : business_mail,
        business_url : business_url,
        business_hotline : business_hotline,
        business_description : business_description,
        business_address : business_address,
        logo_location : logo_location,
        business_hours : business_hours,
        business_registration_numbe : business_registration_number,
        business_type : business_type,
        business_registration_date : business_registration_date,
        status : "pending"
    };

    // Store businessData in Redis with a unique key (e.g., business_mail as key)
    client.set(business_mail, JSON.stringify(businessData), 'EX', 3600); // Expires after 1 hour

    // Create JWT token to identify the business (use business_mail as the unique identifier)
    const token = jwt.sign({ business_mail }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });

    // Send back the token for identification in the second form
    res.status(200).json({ token : token, message: 'Business data temporarily saved, please proceed to the next step' });
});


// Middleware for submitting owner details (second form submission)
const submitOwnerDetails = asyncHandler(async (req, res) => {
    const { business_owner_name, business_owner_mail, business_password } = req.body;
    const token = req.headers.authorization.split(' ')[1]; // Assuming JWT is sent as Bearer token

    if (!token) {
        return res.status(401).json({ message: 'Authorization token required' });
    }

    try {
        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const business_mail = decoded.business_mail;

        // Retrieve business data from Redis
        client.get(business_mail, async (err, businessData) => {
            if (err || !businessData) {
                return res.status(400).json({ message: 'Business data not found or expired' });
            }

            // Parse businessData from Redis
            const parsedBusinessData = JSON.parse(businessData);

            // Now combine the business data and owner's data
            const fullBusinessData = {
                ...parsedBusinessData,
                business_owner_name,
                business_owner_mail,
                business_password // Hash the password before saving
            };

            // Set the status to approved
            fullBusinessData.status = "approved";

            // Make the query to insert into the database (assuming db is your configured database object)
            await db.query(
                'INSERT INTO business SET ?',
                fullBusinessData,
                (error, results) => {
                    if (error) {
                        return res.status(500).json({ message: 'Database error', error });
                    }
                    res.status(201).json({ message: 'Business registered successfully', results });
                }
            );

            // Optionally, delete the Redis key after successful registration
            client.del(business_mail);
        });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token', error });
    }
});


module.exports = { registerBusiness, submitOwnerDetails };