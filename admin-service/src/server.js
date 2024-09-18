const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const categoryRouter = require('./routes/category');
const dotenv = require('dotenv').config();
const createBusinessRouter = require('./routes/registration');
const branchRouter = require('./routes/branch');
const app = express();

// Swagger
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Constants
const PORT =  3001;
const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0', 
      info: {
        title: 'Admin Service API',
        description: 'This is the admin service API of pointmaster',
        contact: {
          name: 'Himindu Kularathne'
        },
        servers: ['http://localhost:3001']
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [{
        bearerAuth: []
      }],
    },
    apis: ['./routes/*.js'], 
  };


// Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
// app.use('/category', categoryRouter);
app.use('/registration', createBusinessRouter);
app.use('/branch', branchRouter); 

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});