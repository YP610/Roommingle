const express = require("express");
const app = express();
const PORT = process.env.PORT || 1000;

app.get("/", (req, res) => {
    res.send("Hello, Pranav!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});