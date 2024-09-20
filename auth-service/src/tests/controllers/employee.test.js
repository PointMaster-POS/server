const { employeeLogginController } = require('../../controllers/employee');
const Employee = require('../../models/employee'); // Import the Employee model
const Business = require('../../models/business'); // Import the Business model if needed
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const httpMocks = require('node-mocks-http');
const db = require('../../config/db');

// Mock the required dependencies
jest.mock('../../models/employee'); // Mock the Employee model
jest.mock('../../models/business'); // Mock the Business model if needed
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');



describe('employeeLogginController', () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should return 400 if email or password is missing', async () => {
    req.body = { email: '', password: '' };

    await employeeLogginController(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Email and password are required' });
  });
//   it('should return 401 if email is not found in employee or business tables', async () => {
//     req.body = { email: 'john.do@example.com', password: 'jahue' };
  
//     // Mock the DB query to simulate no employee found
//     db.query.mockImplementation((query, values, callback) => {
//       if (query.includes('SELECT * FROM employee') || query.includes('SELECT * FROM business')) {
//         callback(null, []); // Simulate no results
//       }
//     });
  
//     await employeeLogginController(req, res);
  
//     expect(res.statusCode).toBe(401);
//     expect(res._getJSONData()).toEqual({ message: 'Invalid email or password' });
//   });
  it('should return 401 if the password does not match for employee', async () => {
    req.body = { email: 'john.doe@example.com', password: 'wrongpassword' };

    // Mock the DB query to return an employee
    Employee.findOne.mockResolvedValue({
      email: 'john.doe@example.com',
      password: '$2a$10$salzB6AYhtdFqXKEeXOBYu13pfF0hreBR2Nw4fmuc9HguCgulKKIa' // Example hashed password
    });

    // Mock bcrypt to return false for password comparison
    bcrypt.compare.mockResolvedValue(false);

    await employeeLogginController(req, res);

    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toEqual({ message: 'Invalid email or password' });
  });

  it('should return a JWT token if email and password are correct for an employee', async () => {
    req.body = { email: 'john.doe@example.com', password: 'correctpassword' };

    // Mock the DB query to return an employee
    Employee.findOne.mockResolvedValue({
      email: 'john.doe@example.com',
      password: 'hashedPassword', // This should be the actual hashed password
      employee_name: 'John Doe',
      employee_id: 1,
      role: 'manager'
    });

    // Mock bcrypt to return true for password comparison
    bcrypt.compare.mockResolvedValue(true);

    // Mock jwt to return a token
    const mockToken = 'mockJwtToken';
    jwt.sign.mockReturnValue(mockToken);

    await employeeLogginController(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ accessToken: mockToken });
  });

  it('should return a JWT token if email and password are correct for a business', async () => {
    req.body = { email: 'business@example.com', password: 'correctpassword' };

    // Mock the DB query to return a business
    Business.findOne.mockResolvedValue({
      business_owner_mail: 'business@example.com',
      business_password: 'hashedPassword', // This should be the actual hashed password
      business_name: 'My Business',
      business_id: 1
    });

    // Mock bcrypt to return true for password comparison
    bcrypt.compare.mockResolvedValue(true);

    // Mock jwt to return a token
    const mockToken = 'mockJwtToken';
    jwt.sign.mockReturnValue(mockToken);

    await employeeLogginController(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ accessToken: mockToken });
  });

  it('should return 500 if there is an error in bcrypt comparison', async () => {
    req.body = { email: 'john.doe@example.com', password: 'himindu123' };

    // Mock the DB query to return an employee
    Employee.findOne.mockResolvedValue({
      email: 'john.doe@example.com',
      password: 'hashedPassword'
    });

    // Mock bcrypt to throw an error
    bcrypt.compare.mockRejectedValue(new Error('bcrypt error'));

    await employeeLogginController(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData());
  });
});
