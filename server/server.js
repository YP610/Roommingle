//imports required packages that we installed through the terminal
const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

//express app
const app = express();
const PORT = process.env.PORT || 1000;


app.get("/", (req, res) => {
    res.send("Hello, Mike!");
});

//listens for requests
app.listen(4000, () => {
    console.log(`Server is running on port ${PORT}`);
});