const express = require('express');
const app = express();

// ROUTE FIRST
app.get('/', (req, res) => {
    res.send("Backend is working ✅");
});

// LISTEN LAST
app.listen(5000, () => {
    console.log("Server is running on port 5000 updated");
});





