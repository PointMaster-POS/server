const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const customerRouter = require('./routes/customer');
const employeeRouter = require('./routes/employee');
const dotenv = require('dotenv').config();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Swagger Configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Auth Service API',
      description: 'API documentation for Authentication Service',
      contact: {
        name: 'Amazing Developer'
      },
      version: '1.0.0',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3002}`,
        description: 'Auth Service Development Server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Point to your route files for documentation
};

// Swagger Docs
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/customer', customerRouter);
app.use('/employee', employeeRouter);

// Export the app for testing or server use
module.exports = app;
