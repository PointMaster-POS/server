const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();


const PORT =  3001;

app.get('/', (req, res) => {
    res.send('Hello World from admin-services');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}   );