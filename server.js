//imports required packages that we installed through the terminal
const express = require("express");
const studentRoutes = require("./students") //requires API routes
const mongoose = require('mongoose');
const cors = require('cors');

//express app
const app = express();
const PORT = process.env.PORT || 1000;

//attaches env variables to processed env objects
require('dotenv').config();


//middleware
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})
// routes
app.get("/", (req, res) => {
    res.send("Hello, Mike!")
});//just a test (delete later)

// uses all the request handlers imported from students.js (must include /api/students route)
app.use('/api/students', studentRoutes)

//connect to mongodb
const dbURI='mongodb+srv://pranav:Pg@cluster0.dcxpq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(dbURI)
    .then(() => {
        //listens for requests
        app.listen(PORT, () => {
        console.log('connected to db & listening on port', PORT);
        });
    })
    .catch((error) => {
        console.error('Error connecting to db', error);
    })




