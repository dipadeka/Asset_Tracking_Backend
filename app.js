const express = require('express');
const mongoose = require('mongoose');
const app = express();

// ROUTE FIRST
app.get('/', (req, res) => {
    res.send("Backend is working ✅");
});

// LISTEN LAST
app.listen(5000, () => {
    console.log("Server is running on port 5000 updated");
});

// MongoDB connection
mongoose.connect('mongodb+srv://dipadeka133:dipadeka133@backenddb.i39qfwt.mongodb.net/Node-API?appName=BackendDB')
  .then(() => {console.log('Connected to MongoDB!');
})
.catch(() => {
    console.log("Error connecting to MongoDB:");
});

