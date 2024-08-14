const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();


const PORT = process.env.PORT || 3004;

app.get('/', (req, res) => {
    res.send('Hello World from customer-services');
});