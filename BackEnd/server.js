//imports required packages that we installed through the terminal
require('dotenv').config();
const cors = require('cors');
const express = require("express");

const userRoutes = require('./routes/userRoutes'); 

//requires API routes
const authRoutes = require('./routes/authRoutes');
const connectDB=require('./db');

//express app
const app = express();
const PORT = process.env.PORT||8080;


//middleware
app.use(express.json())
app.use(cors())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})
// routes
app.get("/", (req, res) => {
    res.send("Hello, Mike!")
});//just a test (delete later)

// uses all the request handlers imported from students.js (must include /api/students route)
app.use('/api/userRoutes', userRoutes)
app.use('/api/auth',authRoutes);

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




