const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product.model');
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

// ROUTE FIRST
app.get('/', (req, res) => {
    res.send("Backend is working ✅");
});

app.get('/api/products', async (req, res) => {
    try {
        const product = await Product.find();
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });

    }
});

app.get('/api/product/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);
        }

    catch (error) {
        res.status(500).json({ message:error.message});
    }
});
       
app.post('/api/product',async (req,res)=>{
    try {
        const product = await Product.create(req.body);
        res.status(200).json(product);
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

});

// LISTEN LAST
app.listen(5000, () => {
    console.log("Server is running on port 5000 updated");
});

// MongoDB connection
mongoose.connect('mongodb+srv://dipadeka133:Dipajorhat@backenddb.i39qfwt.mongodb.net/Node-API?retryWrites=true&w=majority&appName=BackendDB')
  .then(() => {console.log('Connected to MongoDB!');
})
.catch(() => {
    console.log("Error connecting to MongoDB:");
});

