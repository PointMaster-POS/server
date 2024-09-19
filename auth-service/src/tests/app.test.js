const request = require('supertest');
const app = require('../app'); 

// Increase timeout to handle longer requests
jest.setTimeout(10000); 

describe('API Tests', () => {
  // Test for customer login route
  test('should return 200 for the customer login route', async () => {
    const res = await request(app)
      .post('/customer/login')
      .send({
        email: 'john.doe@example.com',  
        password: 'himindu123'  
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  // Test for employee login route
  test('should return 200 for the employee login route', async () => {
    const res = await request(app)
      .post('/employee/login')
      .send({
        email: 'john.doe@example.com', 
        password: 'himindu123'    
      });

    expect(res.statusCode).toBe(200);
    expect(res.body);
  });
});

// Cleanup after tests if necessary
afterAll(async () => {
  
});
