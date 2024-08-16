const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const customerRouter = require("./routes/customer");

const app = express();

const PORT = 3004;

app.use(cors());
app.use(bodyParser.json());

app.use("/customer", customerRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
