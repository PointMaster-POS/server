const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const customerRouter = require('./routes/customer');

//app is an instance of express
const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = 3002;

//define the route for the customer
app.use('/customer', customerRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});