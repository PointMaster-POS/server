const { 
    registerCustomer, 
    updateCustomer, 
    deleteCustomer, 
    getCustomerByPhone, 
    getCustomerPointsByPhone 
  } = require('../../controllers/customer');
  const db = require('../../config/db');
  const httpMocks = require('node-mocks-http');
  const jwt = require('jsonwebtoken');
  
  jest.mock('../../config/db', () => ({
    query: jest.fn(),
    end: jest.fn(),
  }));
  
  jest.setTimeout(10000);
  
  describe('Customer Controller', () => {
    let req, res;
    const mockDecodedToken = { customer_id: 1 };
    const mockToken = jwt.sign(mockDecodedToken, "your_secret_key");
  
    beforeEach(() => {
      req = httpMocks.createRequest();
      res = httpMocks.createResponse();
      req.customer = { customer_id: 1, customer_phone: '1234567890' }; // Mock customer object
    });
  
    afterEach(() => {
      jest.clearAllMocks(); // Clear mocks after each test
    });
  
    // describe('Register new customer', () => {
    //   it('should return 201 and a success message', async () => {
    //     db.query.mockImplementation((query, values, callback) => {
    //       callback(null, { insertId: 1 }); // Simulate successful registration
    //     });
  
    //     await registerCustomer(req, res);
  
    //     expect(res.statusCode).toBe(201);
    //     expect(res._getJSONData()).toEqual({ message: "Customer registered successfully" });
    //   });
  
    //   it('should return 500 if there is a database error', async () => {
    //     db.query.mockImplementation((query, values, callback) => {
    //       callback(new Error('Database error'), null);
    //     });
  
    //     await registerCustomer(req, res);
  
    //     expect(res.statusCode).toBe(500);
    //     expect(res._getJSONData()).toEqual({ message: 'Database error' });
    //   });
    // });
  
    describe('Update customer details', () => {
      it('should return 200 and a success message', async () => {
        req.params.customerId = 1; // Set the customer ID in request params
  
        db.query.mockImplementation((query, values, callback) => {
          callback(null, [{ customer_id: 1 }]); // Simulate existing customer
        });
  
        await updateCustomer(req, res);
  
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ message: "Customer updated successfully" });
      });
  
      it('should return 500 if there is a database error', async () => {
        req.params.customerId = 1;
  
        db.query.mockImplementation((query, values, callback) => {
          callback(new Error('Database error'), null);
        });
  
        await updateCustomer(req, res);
  
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ message: 'Database error' });
      });
    });
  
    describe('Delete customer', () => {
      it('should return 200 and a success message', async () => {
        req.params.customerId = 1;
  
        db.query.mockImplementation((query, values, callback) => {
          callback(null, [{ customer_id: 1 }]); // Simulate existing customer
        });
  
        await deleteCustomer(req, res);
  
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ message: "Customer deleted successfully" });
      });
  
      it('should return 500 if there is a database error', async () => {
        req.params.customerId = 1;
  
        db.query.mockImplementation((query, values, callback) => {
          callback(new Error('Database error'), null);
        });
  
        await deleteCustomer(req, res);
  
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ message: 'Database error' });
      });
    });
  
    describe('Get customer by phone', () => {
      it('should return 200 and customer details', async () => {
        const mockCustomer = { customer_id: 1, customer_name: "John Doe", customer_phone: "1234567890" };
  
        db.query.mockImplementation((query, values, callback) => {
          callback(null, [mockCustomer]); // Simulate finding the customer by phone
        });
  
        await getCustomerByPhone(req, res);
  
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual(mockCustomer);
      });
  
      it('should return 404 if no customer is found', async () => {
        db.query.mockImplementation((query, values, callback) => {
          callback(null, []); // Simulate no customer found
        });
  
        await getCustomerByPhone(req, res);
  
        expect(res.statusCode).toBe(404);
        expect(res._getJSONData())?.toEqual({ message: "Customer not found" });
      });
    });
  
    describe('Get customer points by phone', () => {
      it('should return 200 and customer points', async () => {
        const mockCustomerLoyaltyDetails = { points: 100 };
  
        db.query.mockImplementation((query, values, callback) => {
          callback(null, [mockCustomerLoyaltyDetails]); // Simulate finding loyalty points
        });
  
        await getCustomerPointsByPhone(req, res);
  
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual(mockCustomerLoyaltyDetails);
      });
  
      it('should return 404 if no points are found', async () => {
        db.query.mockImplementation((query, values, callback) => {
          callback(null, []); // Simulate no points found
        });
  
        await getCustomerPointsByPhone(req, res);
  
        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toEqual({ message: "Customer not found" });
      });
    });
  
    afterAll(() => {
      db.end.mockImplementation(() => Promise.resolve()); // Close the database connection
    });
  });
  