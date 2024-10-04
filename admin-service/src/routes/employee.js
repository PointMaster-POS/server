const employeeRouter = require("express").Router();
const validateToken = require("../middleware/validateToken");

const {
  createEmployee,
  getAllEmployees,
  getEmployeeByID,
  getOwnerByID,
   updateEmployee,
   deleteEmployee,
   getAllEmployeeBranch
} = require("../controllers/employee");
const { branchAccess } = require("../middleware/businessAccess");

//branch id is in the body of the request if owner is creating employee
//branch id is in the token if manager is creating employee

employeeRouter.post("/", validateToken, createEmployee);
employeeRouter.get("/all-employee/:branch_id", validateToken, getAllEmployees);
employeeRouter.put("/:employee_id", validateToken, updateEmployee);
employeeRouter.delete("/:employee_id", validateToken, deleteEmployee);

employeeRouter.get("/employee-profile", validateToken, branchAccess , getEmployeeByID);

employeeRouter.get("/owner-profile", validateToken, branchAccess , getOwnerByID);
employeeRouter.get("/branch-employee", validateToken, branchAccess , getAllEmployeeBranch);

module.exports = employeeRouter;
