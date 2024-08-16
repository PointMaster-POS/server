const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();


const PORT =  3003;

app.get('/', (req, res) => {
    res.send('Hello World from cashier-services');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
