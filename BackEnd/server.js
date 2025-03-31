//imports required packages that we installed through the terminal
require('dotenv').config();
const express = require("express");
const userRoutes = require('./routes/userRoutes'); 
const LcRoutes=require('./routes/livingConditionsRoutes');
const contactRoutes=require('./routes/contactRoutes');
const feedRoutes=require('./routes/feedRoutes');
const hobbyRoutes=require('./routes/hobbyRoutes');
//requires API routes
const authRoutes = require('./routes/authRoutes');
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
app.use('/api/userRoutes', userRoutes)
app.use('/api/auth',authRoutes);
app.use('/api/livingConditionsRoutes',LcRoutes)
app.use('/api/feedRoutes',feedRoutes)
app.use('/api/contactRoutes',contactRoutes)
app.use('/api/hobbyRoutes',hobbyRoutes)
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




