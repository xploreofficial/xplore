
require('dotenv').config();
const express = require('express');
const Razorpay = require('razorpay');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

// Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
});

// Create Razorpay order
app.post('/create-order', async (req, res) => {
    const { amount, currency = "INR" } = req.body;

    const options = {
        amount: amount * 100,
        currency,
        receipt: `receipt_order_${Date.now()}`
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (err) {
        res.status(500).send("Error creating Razorpay order");
    }
});

// File download (secured)
app.get('/download/:product', (req, res) => {
    const allowedFiles = {
        "3d-animation": "downloads/animation/3D Cards Animation Project File.drp"
    };

    const fileKey = req.params.product;
    const filePath = allowedFiles[fileKey];
    if (filePath && fs.existsSync(path.join(__dirname, 'public', filePath))) {
        res.download(path.join(__dirname, 'public', filePath));
    } else {
        res.status(404).send("File not found");
    }
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
