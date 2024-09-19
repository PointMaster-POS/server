const { customerLogginController } = require('../../controllers/customer');
const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const httpMocks = require('node-mocks-http');

// Mock the required dependencies
jest.mock('../../config/db');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('customerLogginController', () => {
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

    await customerLogginController(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Email and password are required' });
  });

  it('should return 401 if the email is not found in the database', async () => {
    req.body = { email: 'john.doe@example.com', password: 'himindu123' };
    
    // Mock the DB query to return no results
    db.query.mockImplementation((query, values, callback) => {
      callback(null, []);
    });

    await customerLogginController(req, res);

    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toEqual({ message: 'Invalid email or password' });
  });

//   it('should return 500 if there is a database error', async () => {
//     req.body = { email: 'john.doe@example.com', password: 'himindu123' };

//     // Mock the DB query to simulate an error
//     db.query.mockImplementation((query, values, callback) => {
//       callback(new Error('Database error'), null);
//     });

//     await customerLogginController(req, res);

//     expect(res.statusCode).toBe(500);
//     expect(res._getJSONData()).toEqual(new Error('Database error'));
//   });

  it('should return 401 if the password does not match', async () => {
    req.body = { email: 'john.doe@example.com', password: 'wrongpassword' };

    // Mock the DB query to return a customer
    db.query.mockImplementation((query, values, callback) => {
      callback(null, [{ customer_mail: 'john.doe@example.com', password: 'himindu123' }]);
    });

    // Mock bcrypt to return false for password comparison
    bcrypt.compare.mockResolvedValue(false);

    await customerLogginController(req, res);

    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toEqual({ message: 'Invalid email or password' });
  });

  it('should return a JWT token if email and password are correct', async () => {
    req.body = { email: 'join.doe@example.com', password: 'himindu123' };

    // Mock the DB query to return a customer
    db.query.mockImplementation((query, values, callback) => {
      callback(null, [{ customer_mail: 'test@example.com', password: 'hashedPassword', customer_name: 'John Doe', customer_id: 1 }]);
    });

    // Mock bcrypt to return true for password comparison
    bcrypt.compare.mockResolvedValue(true);

    // Mock jwt to return a token
    const mockToken = 'mockJwtToken';
    jwt.sign.mockReturnValue(mockToken);

    await customerLogginController(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ accessToken: mockToken });
  });

  it('should return 500 if there is an error in bcrypt comparison', async () => {
    req.body = { email: 'test@example.com', password: 'password123' };

    // Mock the DB query to return a customer
    db.query.mockImplementation((query, values, callback) => {
      callback(null, [{ customer_mail: 'test@example.com', password: 'hashedPassword' }]);
    });

    // Mock bcrypt to throw an error
    bcrypt.compare.mockRejectedValue(new Error('bcrypt error'));

    await customerLogginController(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ message: 'Error comparing passwords' });
  });
});
