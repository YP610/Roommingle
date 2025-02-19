//imports required packages that we installed through the terminal
const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 1000;

app.get("/", (req, res) => {
    res.send("Hello, Pranav!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});