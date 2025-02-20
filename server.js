//imports required packages that we installed through the terminal
const express = require("express");
const studentRoutes = require("./routes/students") //requires API routes
const mongoose = require('mongoose');
const cors = require('cors');
//attaches env variables to processed env objects
require('dotenv').config();
//const dbURI=("")

//express app
const app = express();
const PORT = process.env.PORT;

//middleware
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})
// routes
app.get("/", (req, res) => {
    res.send("Hello, Yash!")
});//just a test

app.use(studentRoutes)



//listens for requests
app.listen(PORT, () => {
    console.log('listening on port', PORT);
});