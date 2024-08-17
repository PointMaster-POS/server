const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const customerRouter = require("./routes/customer");
const dotenv = require("dotenv").config();
 const shopRouter = require("./routes/shop");
const billsRouter = require("./routes/bills");
const loyalityRouter = require("./routes/loyality");

const app = express();
const PORT = 3004;
app.use(cors());
app.use(bodyParser.json());

//plugging in the routers
app.use("/customer", customerRouter);
app.use("/shop", shopRouter);
app.use("/bills", billsRouter);
app.use("/loyalty", loyalityRouter);

//listening to the port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


