const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const AssetsRoute = require('./routes/asset.route');
const emrsRoute = require('./routes/emrsRoute');


const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routes
app.use("/api/assets", AssetsRoute);
app.use("/api/emrs", emrsRoute);

// Test route
app.get('/', (req, res) => {
  res.send("Backend is working ✅");
});


// MongoDB connection
mongoose.connect('mongodb://localhost:27017/asset-management')
.then(() => {
  console.log('Connected to MongoDB!');
})
.catch((error) => {
  console.log("Error connecting to MongoDB:", error);
});

// Start server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});