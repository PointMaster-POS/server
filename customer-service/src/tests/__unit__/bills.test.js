const { getAllBillsByCustomerId, getBillByID, getAllBillsByBusinessID } = require('../../controllers/bills');
const db = require('../../config/db');
const httpMocks = require('node-mocks-http');

// Mock the required dependencies
jest.mock('../../config/db',  () => {
    return {
      query: jest.fn(),
      end: jest.fn(), // Mock the end function to avoid issues
    };});
jest.setTimeout(10000); 

describe('Bills Controller', () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();

    // Mock customer object that is normally injected by the middleware
    req.customer = {
      customer_phone: '1234567890', // Add any necessary fields here
      customer_id: 1,
    };
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('getAllBillsByCustomerId', () => {
    it('should return 200 and all bills for the customer', async () => {
      const mockBills = [
        { bill_id: 1, amount: 100, customer_id: 1 },
        { bill_id: 2, amount: 200, customer_id: 1 },
      ];

      // Mock DB query to return bills
      db.query.mockImplementation((query, values, callback) => {
        callback(null, mockBills);
      });

      await getAllBillsByCustomerId(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockBills);
    });

    it('should return 500 if there is a database error', async () => {
      // Mock DB query to simulate an error
      db.query.mockImplementation((query, values, callback) => {
        callback(new Error('Database error'), null);
      });

      await getAllBillsByCustomerId(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ message: 'Database error' });
    });
  });

  describe('getBillByID', () => {
    it('should return 200 and bill details by bill id', async () => {
      req.params.billId = 1;

      const mockBill = { bill_id: 1, amount: 100, customer_id: 1 };

      // Mock DB query to return the bill
      db.query.mockImplementation((query, values, callback) => {
        callback(null, [mockBill]);
      });

      await getBillByID(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockBill);
    });

    it('should return 500 if there is a database error', async () => {
      req.params.billId = 1;

      // Mock DB query to simulate an error
      db.query.mockImplementation((query, values, callback) => {
        callback(new Error('Database error'), null);
      });

      await getBillByID(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ message: 'Database error' });
    });
  });

  describe('getAllBillsByBusinessID', () => {
    it('should return 200 and all bills for the business', async () => {
      req.params.businessId = 1;

      const mockBills = [
        { bill_id: 1, amount: 100, business_id: 1 },
        { bill_id: 2, amount: 200, business_id: 1 },
      ];

      // Mock DB query to return bills
      db.query.mockImplementation((query, values, callback) => {
        callback(null, mockBills);
      });

      await getAllBillsByBusinessID(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockBills);
    });

    // it('should return 404 if no bills are found', async () => {
    //   req.params.businessId = 1;

    //   // Mock DB query to return no bills
    //   db.query.mockImplementation((query, values, callback) => {
    //     callback(null, []);
    //   });

    //   await getAllBillsByBusinessID(req, res);

    //   expect(res.statusCode).toBe(404);
    //   expect(res._getJSONData()).toEqual({ message: 'No bills found' });
    // });

    it('should return 500 if there is a database error', async () => {
      req.params.businessId = 1;

      // Mock DB query to simulate an error
      db.query.mockImplementation((query, values, callback) => {
        callback(new Error('Database error'), null);
      });

      await getAllBillsByBusinessID(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ message: 'Database error' });
    });
  });
  afterAll(() => {
    // Close the database connection
    db.end.mockImplementation(() => Promise.resolve());
  });
  
});


