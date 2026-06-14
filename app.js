require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const AssetsRoute = require('./routes/asset.route');
const emrsRoute = require('./routes/emrsRoute');
const emrsAuthRoute = require('./routes/emrsAuth.route');
const { seedEmrsUsers } = require('./utils/seedEmrsUsers');

const AuthRoute = require('./routes/auth.route')
const app = express();

// Middleware — CORS must allow browser preflight (OPTIONS) from Vite dev server
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/assets", AssetsRoute);
app.use("/api/emrs", emrsRoute);
app.use("/api/emrs/auth", emrsAuthRoute);
app.use("/api/auth", AuthRoute);


// Test route
app.get('/', (req, res) => {
  res.send("Backend is working ✅");
});


// MongoDB connection
const mongoUri = process.env.DB_URL || 'mongodb://localhost:27017/asset-management';

mongoose.connect(mongoUri)
.then(async () => {
  console.log('Connected to MongoDB!');
  await seedEmrsUsers();
})
.catch((error) => {
  console.log("Error connecting to MongoDB:", error);
});

// Start server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});