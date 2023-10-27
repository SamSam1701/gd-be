const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3001;
app.use(cors());
app.use(bodyParser.json());

const dataFilePath = './app/data/shoes.json';

console.log(dataFilePath);

// Read the product data from the JSON file
function readProductData() {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading product data:', error);
        return { shoes: [] };
    }
}

// Get all products
app.get('/api/v1/products', (req, res) => {
    const products = readProductData().shoes;
    res.json(products);
});

// Get a product by ID
app.get('/api/v1/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const products = readProductData().shoes;
    const product = products.find((p) => p.id === productId);

    if (!product) {
        res.status(404).json({ message: 'Product not found' });
    } else {
        res.json(product);
    }
});

// Create a new product
app.post('/api/v1/products', (req, res) => {
    const products = readProductData().shoes;
    const newProduct = req.body;
    newProduct.id = products.length + 1;
    products.push(newProduct);

    fs.writeFileSync(dataFilePath, JSON.stringify({ shoes: products }, null, 2));

    res.status(201).json(newProduct);
});

// Update a product by ID
app.put('/api/v1/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const products = readProductData().shoes;
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
        res.status(404).json({ message: 'Product not found' });
    } else {
        products[productIndex] = { ...products[productIndex], ...req.body };

        fs.writeFileSync(dataFilePath, JSON.stringify({ shoes: products }, null, 2));

        res.json(products[productIndex]);
    }
});

// Delete a product by ID
app.delete('/api/v1/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const products = readProductData().shoes;
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
        res.status(404).json({ message: 'Product not found' });
    } else {
        products.splice(productIndex, 1);

        fs.writeFileSync(dataFilePath, JSON.stringify({ shoes: products }, null, 2));

        res.json({ message: 'Product deleted' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});