const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    console.log({ token });
    console.log(process.env.ACCESS_TOKEN_SECRET);
   
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
          req.employee = decoded.employee;
          console.log({ employee: req.employee }); 
          next();
        }
      }
    });
  }
});

module.exports = validateToken;
