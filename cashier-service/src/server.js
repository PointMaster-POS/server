const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv').config();

const inventoryRouter = require('./routes/inventory');
const historyRouter = require('./routes/history');
const customerRouter = require('./routes/customer');
const loyaltyRouter = require('./routes/loyalty');

const app = express();


const PORT =  3003;

app.use(cors());
app.use(bodyParser.json());


app.use('/cashier', inventoryRouter);
app.use('/cashier/history', historyRouter);
app.use('/cashier/customer', customerRouter);
app.use('/cashier/loyalty', loyaltyRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

