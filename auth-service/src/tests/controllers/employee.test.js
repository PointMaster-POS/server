const { employeeLogginController } = require('../../controllers/employee');
const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const httpMocks = require('node-mocks-http');

// Mock the required dependencies
jest.mock('../../config/db');
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

  it('should return 401 if email is not found in employee or business tables', async () => {
    //wrong email and wrong password
    req.body = { email: 'john.do@example.com', password: 'jahue' };
    
    // Mock the DB query to return no results for all queries
    db.query.mockImplementation((query, values, callback) => {
      callback(null, []);
    });

    await employeeLogginController(req, res);

    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toEqual({ message: 'Invalid email or password' });
  });

//   it('should return 500 if there is a database error', async () => {
//     req.body = { email: 'test@example.com', password: 'password123' };

//     // Mock the DB query to simulate a database error
//     db.query.mockImplementation((query, values, callback) => {
//       callback(new Error('Database error'), null);
//     });

//     await employeeLogginController(req, res);

//     expect(res.statusCode).toBe(500);
//     expect(res._getJSONData()).toEqual({ message: 'Internal server error' });
//   });

  it('should return 401 if the password does not match', async () => {
    req.body = { email: 'john.doe@example.com', password: 'wrongpassword' };
    // Mock the DB query to return an employee
    db.query.mockImplementation((query, values, callback) => {
      if (query.includes('SELECT * FROM employee')) {
        callback(null, [{ email: 'john.doe@example.com', password: '$2a$10$salzB6AYhtdFqXKEeXOBYu13pfF0hreBR2Nw4fmuc9HguCgulKKIa' }]);
      } else {
        callback(null, []);
      }
    });

    // Mock bcrypt to return false for password comparison
    bcrypt.compare.mockResolvedValue(false);

    await employeeLogginController(req, res);

    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toEqual({ message: 'Invalid email or password' });
  });

  it('should return a JWT token if email and password are correct for an employee', async () => {
    req.body = { email: 'john.doe@example.com', password: 'himindu123' };

    // Mock the DB query to return an employee
    db.query.mockImplementation((query, values, callback) => {
      if (query.includes('SELECT * FROM employee')) {
        callback(null, [{ email: 'test@example.com', password: 'hashedPassword', employee_name: 'John Doe', employee_id: 1, role: 'manager' }]);
      } else {
        callback(null, []);
      }
    });

    // Mock bcrypt to return true for password comparison
    bcrypt.compare.mockResolvedValue(true);

    // Mock jwt to return a token
    const mockToken = 'mockJwtToken';
    jwt.sign.mockReturnValue(mockToken);

    await employeeLogginController(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockToken);
  });

  it('should return a JWT token if email and password are correct for a business', async () => {
    req.body = { email: 'john.doe@example.com', password: 'himindu123' };

    // Mock the DB query to return a business
    db.query.mockImplementation((query, values, callback) => {
      if (query.includes('SELECT * FROM business')) {
        callback(null, [{ business_owner_mail: 'john.doe@example.com', business_password: 'hashedPassword', business_name: 'My Business', business_id: 1 }]);
      } else {
        callback(null, []);
      }
    });

    // Mock bcrypt to return true for password comparison
    bcrypt.compare.mockResolvedValue(true);

    // Mock jwt to return a token
    const mockToken = 'mockJwtToken';
    jwt.sign.mockReturnValue(mockToken);

    await employeeLogginController(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockToken);
  });

  it('should return 500 if there is an error in bcrypt comparison', async () => {
    req.body = { email: 'john.doe@example.com', password: 'himindu123' };

    // Mock the DB query to return an employee
    db.query.mockImplementation((query, values, callback) => {
      if (query.includes('SELECT * FROM employee')) {
        callback(null, [{ email: 'test@example.com', password: 'hashedPassword' }]);
      } else {
        callback(null, []);
      }
    });

    // Mock bcrypt to throw an error
    bcrypt.compare.mockRejectedValue(new Error('bcrypt error'));

    await employeeLogginController(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ message: 'Internal server error' });
  });
});
