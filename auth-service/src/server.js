const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const customerRouter = require('./routes/customer');
const employeeRouter = require('./routes/employee');
const dotenv = require('dotenv').config();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

//app is an instance of express
const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = 3002;

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
        url: 'http://localhost:3002',
        description: 'Auth Service Development Server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Point to your route files for documentation
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Define the routes for customer and employee login
app.use('/customer', customerRouter);
app.use('/employee', employeeRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
