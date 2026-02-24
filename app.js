const express = require('express');
const mongoose = require('mongoose');
const AssetsRoute = require('./routes/asset.route');
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Middleware to parse URL-encoded bodies

app.use("/api/assets", AssetsRoute);

// ROUTE FIRST
app.get('/', (req, res) => {
    res.send("Backend is working ✅");
});

 



// LISTEN LAST
app.listen(5000, () => {
    console.log("Server is running on port 5000 updated");
});

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/asset-management')
  .then(() => {console.log('Connected to MongoDB!');
})
.catch(() => {
    console.log("Error connecting to MongoDB:");
});

