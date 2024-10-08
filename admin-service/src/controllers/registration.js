const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // For password hashing
const { getRedisClient } = require('../config/redisclient');
const db = require('../config/db'); // Assuming this is your database configuration
const { sendEmail } = require("../utils/email");
const generatePW = require("generate-password");
const Mailgen = require("mailgen");

// Controller for first form submission (business details)
const registerBusiness = asyncHandler(async (req, res) => {
    const {
        business_name,
        business_mail,
        business_url,
        business_hotline,
        business_description,
        business_address,
        logo_url,
        business_hours,
        business_registration_number,
        business_type,
        business_registration_date,
    } = req.body;

    // Validate required fields
    if (!business_name || !business_mail) {
        return res.status(400).json({ message: 'Business name and mail are required' });
    }
    console.log(req.body);
    
    const businessData = {
        business_name,
        business_mail,
        business_url,
        business_hotline,
        business_description,
        business_address,
        logo_url,
        business_registration_number,
        business_type,
        business_registration_date,
        status: 0,
    };

    const client = getRedisClient();

    // Check if the business already exists in Redis
    // const exists = await client.exists(business_mail);
    if (false) {
        console.log('Business data already exists');
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


//verify email endpoint 

const verifyEmailSending = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Generate 4-digit code
    const code = Math.floor(1000 + Math.random() * 9000);

    // Configure Mailgen for email template
    let mailGenerator = new Mailgen({
        theme: 'salted',
        product: {
            name: 'PointMaster',
            logo : 'https://firebasestorage.googleapis.com/v0/b/pointmaster-79d9a.appspot.com/o/business-logos%2FP.png?alt=media&token=602901a8-1db2-4cea-ba6a-307075d9c4b3',
            link: 'https://pointmaster.com'
        }
    });

    //save the code in redis key should be email and value should be code
    const client = getRedisClient();
    await client.set(email, code, 'EX', 300); // Expires in 5 minutes


    // Define email content
    const emailContent = {
        body: {
            name: email, // or you can use a user's name if available
            intro: 'Welcome to PointMaster! We are excited to have you on board.',
            table: {
                data: [
                    {
                        'Your Verification Code': `<strong style="font-size: 24px; color: #FF5722;">${code}</strong>` // Highlight code with style
                    }
                ],
                columns: { // Adjust table settings for better alignment
                    customWidth: {
                        'Your Verification Code': '30%'
                    },
                    customAlignment: {
                        'Your Verification Code': 'center'
                    }
                }
            },
            action: {
                instructions: 'Please use the above code to complete your verification process. Simply enter the code on the verification page:',
                button: {
                    color: '#22BC66', // Customize button color to green
                    text: 'Verify Now',
                    link: 'https://yourcompanywebsite.com/verify'
                }
            },
            outro: 'Need help or have questions? Just reply to this email, we\'re always happy to assist!',
            signature: 'Best regards, The PointMaster Team'
        }
    };
    

    // Generate HTML content
    const mailHtml = mailGenerator.generate(emailContent);
    
    // Generate plaintext version (optional but recommended)
    const mailText = mailGenerator.generatePlaintext(emailContent);

    // Subject for the email
    const subject = "Your Verification Code";

    // Send the email using your email sending function
    sendEmail(email, subject, mailText, mailHtml);

    res.status(200).json({ message: 'Verification email sent successfully' });
});


//verify email endpoint
const verifyMail = asyncHandler(async (req, res) => {
    const { email, code } = req.body;

    const client = getRedisClient();
    const storedCode = await client.get(email);

    if (code === storedCode) {
        return res.status(200).json({ message: 'Verification successful' });
    } else {
        return res.status(400).json({ message: 'Invalid verification code' });
    }
});



module.exports = { registerBusiness, submitOwnerDetails, verifyEmailSending, verifyMail };
