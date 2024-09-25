const asyncHandler = require("express-async-handler");
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

// Register new customer
const registerCustomer = asyncHandler(async (req, res) => {
  const {
    customer_name,
    customer_mail,
    customer_phone,
    birthday,
    gender,
    hashed_pw,
  } = req.body;

  if (!customer_name || !customer_mail || !hashed_pw) {
    return res
      .status(400)
      .json({ message: "Please provide name, email, and password" });
  }

  // Check if the email is already registered
  const checkEmailQuery = `SELECT * FROM customer WHERE customer_mail = ?`;
  db.query(checkEmailQuery, [customer_mail], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // If email does not exist, proceed with registration
    const registerCustomerQuery = `INSERT INTO customer (customer_name, customer_mail, customer_phone, birthday, gender, password) VALUES (?,?,?,?,?,?)`;

    db.query(
      registerCustomerQuery,
      [
        customer_name,
        customer_mail,
        customer_phone,
        birthday,
        gender,
        hashed_pw,
      ],
      (err, result) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        } else {
          return res
            .status(201)
            .json({ message: "Customer registered successfully" });
        }
      }
    );
  });
});

//controller to get all customers
const getAllCustomers = asyncHandler(async (req, res) => {
  const query = "SELECT * FROM customer";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(200).json(results);
  });
});

//controller to update customer details , by decoding the token and getting the customer id
//protected route
const updateCustomer = asyncHandler(async (req, res) => {
  const { customer_name, customer_mail, customer_phone, birthday, gender } =
    req.body;

  const query = `UPDATE customer SET customer_name = ?, customer_mail = ?, customer_phone = ?, birthday = ?, gender = ? WHERE customer_id = ?`;

  const customer_id = req.customer.customer_id;
  //query to update customer
  db.query(
    query,
    [
      customer_name,
      customer_mail,
      customer_phone,
      birthday,
      gender,
      customer_id,
    ],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      return res.status(200).json({ message: "Customer updated successfully" });
    }
  );
});

//controller to delete customer
//protected route
const deleteCustomer = asyncHandler(async (req, res) => {
  const customer_id = req.customer.customer_id;
  const query = `DELETE FROM customer WHERE customer_id = ?`;
  db.query(query, [customer_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(200).json({ message: "Customer deleted successfully" });
  });
});


const getCustomerByPhone = asyncHandler(async (req, res) => {
  const phone = req.params.phone;
  const query = `SELECT * FROM customer WHERE customer_phone = ?`;
  

  db.query(query, [phone], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (results.length > 0) {
      return res.status(200).json(results[0]);
    } else {
      return res.status(404).json({ message: "Customer not found" });
    }
  });
});

const getCustomerPointsByPhone = asyncHandler(async (req, res) => {
  const phone = req.params.phone;
  const businessID = req.params.buinessID;
  //get customer details by phone
  const query = `SELECT * FROM customer WHERE customer_phone = ?`;

  db.query(query, [phone], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (results.length > 0) {
      const customer = results[0];
      //get customer loyality program id
      const query = `SELECT * FROM loyalty_programs WHERE business_id = ?`;
      db.query(query, [businessID], (err, results) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
        const loyaltyProgram = results[0];
        if (!loyaltyProgram) {
          return res.status(404).json({ message: "Loyalty Program not found" });
        }
        //get customer loyality points
        const query = `SELECT * FROM customer_loyalty WHERE customer_id = ? AND loyalty_program_id = ?`;
        db.query(
          query,
          [customer.customer_id, loyaltyProgram.loyalty_program_id],
          (err, results) => {
            if (err) {
              return res.status(500).json({ message: err.message });
            }
            if (results.length > 0) {
              const customerLoyaltyDetails = results[0];
              return res.status(200).json(customerLoyaltyDetails);
            }
          }
        );
      });
     
      
    } else {
      return res.status(404).json({ message: "Customer not found" });
    }
  });
}

);


module.exports = {
  registerCustomer,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomerByPhone,
  getCustomerPointsByPhone
};
