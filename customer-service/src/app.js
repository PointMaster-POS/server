const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const customerRouter = require("./routes/customer");
const shopRouter = require("./routes/shop");
const billsRouter = require("./routes/bills");
const loyaltyRouter = require("./routes/loyalty");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const dotenv = require("dotenv").config();

// Create the Express app
const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Cashier Service API",
      description: "API documentation for the Cashier Service",
      version: "1.0.0",
      contact: {
        name: "Amazing Developer",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3004}`,
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.js"], // Path to the API route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Plugging in the routers
app.use("/customer", customerRouter);
app.use("/shop", shopRouter);
app.use("/bills", billsRouter);
app.use("/loyalty", loyaltyRouter);

// Export the app
module.exports = app;
