const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();

app.use(cors());

const PORT = process.env.PORT || 1330;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})