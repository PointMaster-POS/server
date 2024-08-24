const request = require('supertest');
const express = require('express');
const { getHistory } = require('../controllers/yourControllerFile'); // Update with the correct path to your controller
const db = require('../config/db'); // Update with the correct path to your db configuration

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Mock the route
app.get('/history', getHistory);

// Mock the database query
jest.mock('../config/db', () => ({
  query: jest.fn()
}));

describe('GET /history', () => {
  it('should return history for a given branch_id', async () => {
    // Mock data
    const mockData = [
      { bill_id: 1, branch_id: '123', amount: 100 },
      { bill_id: 2, branch_id: '123', amount: 200 }
    ];

    // Mock the query method to return mock data
    db.query.mockImplementation((query, params, callback) => {
      callback(null, mockData);
    });

    // Mock req and res
    const req = {
      branch: {
        branch_id: '123'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Call the handler
    await getHistory(req, res);

    // Verify that the status and json methods were called with correct values
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it('should return 500 if there is a database error', async () => {
    // Mock error
    const mockError = new Error('Database error');

    // Mock the query method to return an error
    db.query.mockImplementation((query, params, callback) => {
      callback(mockError, null);
    });

    // Mock req and res
    const req = {
      branch: {
        branch_id: '123'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Call the handler
    await getHistory(req, res);

    // Verify that the status and json methods were called with correct values
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: mockError.message });
  });
});
