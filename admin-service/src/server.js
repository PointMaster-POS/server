const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const categoryRouter = require('./routes/category');
const dotenv = require('dotenv').config();
const app = express();

// Swagger
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


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

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));



app.use(cors());
app.use(bodyParser.json());

app.use('/category', categoryRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});