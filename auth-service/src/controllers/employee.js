const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const employeeLogginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  db.query(
    "SELECT * FROM employee WHERE employee_email = ?",
    [email],
    async (err, result) => {
      if (err) {
        res.status(400).json(err);
        console.log(err);
      } else {
        if (result.length === 0) {
          db.query("SELECT * FROM employee WHERE employee_name = ?", [email], async (err, result) => {
            if (err) {
              res.status(400).json(err);
              console.log(err);
            } else {
              if (result.length === 0) {
                db.query("SELECT * FROM business WHERE business_owner_mail = ?", [email], async (err, result) => {
                  if (err) {
                    res.status(400).json(err);
                    console.log(err);
                  } else {
                    if (result.length === 0) {
                      db.query("SELECT * FROM business WHERE business_mail = ?", [email], async (err, result) => {
                        if (err) {
                          res.status(400).json(err);
                          console.log(err);
                        } else {
                          if (result.length === 0) {
                            res.status(401).json({ message: "Invalid email or password" });
                          } else {
                            const business = result[0];
                            console.log(business);
                            let isMatch = false;
                    
                            if (!business) {
                              return res.status(401).json({ message: "Invalid email or business_password" });
                            } else {
                              console.log({ business: business });
                    
                              try {
                                isMatch = await bcrypt.compare(password, business.business_password);
                                if (isMatch) {
                                  const accessToken = jwt.sign(
                                    {
                                      owner: {
                                        business_name: business.business_name,
                                        business_id: business.business_id,
                                        email: business.business_owner_mail,
                                      },
                                    },
                                    process.env.ACCESS_TOKEN_SECRET,
                                    { expiresIn: "30m" }
                                  );
                                  res.status(200).json(accessToken);
                                } else {
                                  res.status(401).json({ message: "Invalid email or password" });
                                }
                              } catch (error) {
                                console.log(error);
                                res.status(500).json({ message: "Internal server error" });
                              }
                            }
                          }
                        }

                      });
                    }
                    else{
                      const business = result[0];
                      console.log(business);
                      let isMatch = false;
              
                      if (!business) {
                        return res.status(401).json({ message: "Invalid email or business_password" });
                      } else {
                        console.log({ business: business });
              
                        try {
                          isMatch = await bcrypt.compare(password, business.business_password);
                          if (isMatch) {
                            const accessToken = jwt.sign(
                              {
                                owner: {
                                  business_name: business.business_name,
                                  business_id: business.business_id,
                                  email: business.business_owner_mail,
                                },
                              },
                              process.env.ACCESS_TOKEN_SECRET,
                              { expiresIn: "30m" }
                            );
                            res.status(200).json(accessToken);
                          } else {
                            res.status(401).json({ message: "Invalid email or password" });
                          }
                        } catch (error) {
                          console.log(error);
                          res.status(500).json({ message: "Internal server error" });
                        }
                      }
                    }
                  }
                }
                );
              }
              else{
                const employee = result[0];
                console.log(employee);
                let isMatch = false;
        
                if (!employee) {
                  return res.status(401).json({ message: "Invalid email or password" });
                } else {
                  console.log({ employee: employee });
        
                  try {
                    isMatch = await bcrypt.compare(password, employee.password);
                    if (isMatch) {
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
                        { expiresIn: "30m" }
                      );
                      res.status(200).json(accessToken);
                    } else {
                      res.status(401).json({ message: "Invalid email or password" });
                    }
                  } catch (error) {
                    console.log(error);
                    res.status(500).json({ message: "Internal server error" });
                  }
                }
              }
            }
          }

          );

        }
        else{
        const employee = result[0];
        console.log(employee);
        let isMatch = false;

        if (!employee) {
          return res.status(401).json({ message: "Invalid email or password" });
        } else {
          console.log({ employee: employee });

          try {
            isMatch = await bcrypt.compare(password, employee.password);
            if (isMatch) {
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
                { expiresIn: "30m" }
              );
              res.status(200).json(accessToken);
            } else {
              res.status(401).json({ message: "Invalid email or password" });
            }
          } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
          }
        }
      }

        // if (isMatch) {
        //   const accessToken = jwt.sign(
        //     {
        //       employee: {
        //         employee_name: employee.employee_name,
        //         employee_id: employee.employee_id,
        //         employee_role: employee.role,
        //         email: employee.email,
        //       },
        //     },
        //     process.env.ACCESS_TOKEN_SECRET,
        //     { expiresIn: "30m" }
        //   );

        // const refreshToken = jwt.sign(
        //   {
        //     employee: {
        //       employee_name: employee.employee_name,
        //       employee_id: employee.employee_id,
        //       email: employee.email,
        //     },
        //   },
        //   "panadura",
        //   { expiresIn: "120m" }
        // );
      }
    }
  );
});

module.exports = { employeeLogginController };
