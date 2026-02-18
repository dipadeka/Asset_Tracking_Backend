
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product.model');
const dotenv = require('dotenv');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

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
        const { id } = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);
    }

    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/product', async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(200).json(product);
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

});

app.put('/api/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        const updatedProduct = await Product.findById(id);
        res.status(200).json(updatedProduct);
    } catch (error) {

        res.status(500).json({ message: error.message });
    }
});

//delete product
app.delete('/api/product/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// MongoDB connection
if (!MONGO_URI) {
    console.error('Missing MONGO_URI environment variable. Set it in your environment.');
    process.exit(1);
}

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB!');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err && err.message ? err.message : err);
        process.exit(1);
    });
