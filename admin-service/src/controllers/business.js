
const db = require('../config/db'); 
const asyncHandler = require('express-async-handler');

/*
+------------------------------+---------------+------+-----+---------+-------+
| Field                        | Type          | Null | Key | Default | Extra |
+------------------------------+---------------+------+-----+---------+-------+
| business_id                  | varchar(36)   | NO   | PRI | NULL    |       |
| business_name                | varchar(255)  | NO   |     | NULL    |       |
| business_mail                | varchar(255)  | NO   |     | NULL    |       |
| business_url                 | varchar(2048) | YES  |     | NULL    |       |
| business_hotline             | varchar(64)   | YES  |     | NULL    |       |
| business_description         | text          | YES  |     | NULL    |       |
| business_address             | varchar(1048) | YES  |     | NULL    |       |
| business_owner_name          | varchar(255)  | NO   |     | NULL    |       |
| business_owner_mail          | varchar(255)  | NO   |     | NULL    |       |
| business_owner_phone         | varchar(55)   | YES  |     | NULL    |       |
| business_owner_address       | varchar(255)  | YES  |     | NULL    |       |
| business_owner_birthday      | date          | YES  |     | NULL    |       |
| business_owner_photo_url     | varchar(2048) | YES  |     | NULL    |       |
| business_password            | varchar(2048) | NO   |     | NULL    |       |
| logo_location                | varchar(255)  | YES  |     | NULL    |       |
| business_registration_number | varchar(100)  | YES  |     | NULL    |       |
| business_type                | varchar(50)   | YES  |     | NULL    |       |
| business_registration_date   | date          | YES  |     | NULL    |       |
| status                       | tinyint(1)    | NO   |     | NULL    |       |
+------------------------------+---------------+------+-----+---------+-------+
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
        logo_url,
        business_registration_number,
        business_type,
        business_registration_date,
    } = req.body;

    if (!business_name || !business_mail) {
        return res.status(400).json({ message: 'Business name and mail are required' });
    }

    const updateBusinessQuery = `UPDATE business SET business_name = ?, business_mail = ?, business_url = ?, business_hotline = ?, business_description = ?, business_address = ?, logo_url = ?, business_registration_number = ?, business_type = ?, business_registration_date = ? WHERE business_id = ?`;

    db.query(updateBusinessQuery, [business_name, business_mail, business_url, business_hotline, business_description, business_address, logo_url, business_registration_number, business_type, business_registration_date, business_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        } else {
            return res.status(200).json({ message: 'Business details updated successfully' });
        }
    }

);
});

const updateOwnerDetails = asyncHandler((req, res) => {
    const business_id = req.owner.business_id;

    const {
        business_owner_name,
        business_owner_mail,
        business_owner_phone,
        business_owner_address,
        business_owner_birthday,
        business_owner_photo_url,
    } = req.body;
    db.query(
        `UPDATE business SET business_owner_name = ?, business_owner_mail = ?, business_owner_phone = ?, business_owner_address = ?, business_owner_birthday = ?, business_owner_photo_url = ? WHERE business_id = ?`, 
        [business_owner_name, business_owner_mail, business_owner_phone, business_owner_address, business_owner_birthday, business_owner_photo_url, business_id], 
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            } else {
                return res.status(200).json({ message: 'Owner details updated successfully' });
            }
        });
        
}
    
    );


module.exports = { updateBusinessDetails, updateOwnerDetails };