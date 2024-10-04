const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const verifyCashier = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
   
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {

      if (token === null) {
        return res.status(401).json({ message: "User is not Authorized" });
      } else {
        console.log({ deco: decoded });
        if (err) {
          return res.status(401).json({ message: "User is not Authorized" });
        } else {
          if (err) {
            res.status(401).json({ message: "User is not Authorized" });
          }
          req.cashier = decoded.employee;
          next();
        }
      }
    });
  }
});

module.exports = verifyCashier;
