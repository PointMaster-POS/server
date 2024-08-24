const request = require('supertest');
const express = require('express');
const app = express();
const db = require('../../config/db');
const { getCustomer } = require('../../controllers/customer');

// Create a test route for the controller
app.use(express.json());
app.get('/customer/:phone', getCustomer);

// Mock database
jest.mock('../../config/db', () => ({
  query: jest.fn(),
}));


describe('GET /customer/:phone', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return customer data for a valid phone number', async () => {
    const mockPhone = '1234567890';
    const mockResult = [{ customer_id: 1, customer_name: 'John Doe', customer_phone: mockPhone }];

    db.query.mockImplementation((query, values, callback) => {
      callback(null, mockResult);
    });

    const response = await request(app).get(`/customer/${mockPhone}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResult);
  });

  it('should return 500 if there is a database error', async () => {
    const mockPhone = '1234567890';
    const mockError = new Error('Database error');

    db.query.mockImplementation((query, values, callback) => {
      callback(mockError);
    });

    const response = await request(app).get(`/customer/${mockPhone}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: mockError.message });
  });
});
