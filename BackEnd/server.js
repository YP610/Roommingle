//imports required packages that we installed through the terminal
require('dotenv').config();
const express = require("express");
const connections = require('./routes/databaseRoutes'); //requires API routes
const cors = require('cors');
const connectDB=require('./db');

//express app
const app = express();
const PORT = process.env.PORT||8080;


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
app.use('/api/routes/databaseRoutes', connections)

//connect to mongodb
connectDB()
    .then(() => {
        //listens for requests
        app.listen(PORT, () => {
        console.log('connected to db & listening on port', PORT);
        });
    })
    .catch((error) => {
        console.error('Error connecting to db', error);
    })




