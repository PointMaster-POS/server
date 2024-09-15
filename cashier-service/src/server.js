const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const inventoryRouter = require('./routes/inventory');
const historyRouter = require('./routes/history');
const customerRouter = require('./routes/customer');
const loyaltyRouter = require('./routes/loyalty');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const dotenv = require('dotenv').config();

const app = express();

const PORT = 3003;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Cashier Service API',
        description: 'API documentation for the Cashier Service',
        version: '1.0.0',
        contact: {
          name: 'Amazing Developer',
        },
      },
      servers: [
        {
          url: 'http://localhost:3003',
          description: 'Cashier Service Development Server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT', // Specifies the format of the token
          },
        },
      },
    },
    apis: ['./routes/*.js'], // Specify the path for route files
  };
  
// Swagger setup
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/cashier/inventory', inventoryRouter);
app.use('/cashier/history', historyRouter);
app.use('/cashier/customer', customerRouter);
app.use('/cashier/loyalty', loyaltyRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
