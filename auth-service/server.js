const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();


const PORT = 3002;

app.get('/', (req, res) => {
    res.send('Hello World from auth-services');
});