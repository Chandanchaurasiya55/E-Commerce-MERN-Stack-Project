const express = require('express');
const app = express();
const cors = require('cors');
const userRoute = require('../src/Routes/user.route')
const adminRoute = require('../src/Routes/admin.route')
const productRoute = require('../src/Routes/product.route')
const cartRoute = require('../src/Routes/cart.route')
const orderRoute = require('../src/Routes/order.route')
const notificationRoute = require('../src/Routes/notification.route')


app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));

app.use(express.json());

app.use('/api/auth', userRoute);
app.use('/api/auth', adminRoute);
app.use('/api', productRoute);
app.use('/api/cart', cartRoute);
app.use('/api/order', orderRoute);
app.use('/api/notifications', notificationRoute);

// Basic system status endpoint
const mongoose = require('mongoose');
app.get('/api/status', (req, res) => {
    try {
        const dbConnected = mongoose.connection && mongoose.connection.readyState === 1;
        const paymentConfigured = !!process.env.PAYMENT_KEY; // mock check
        const emailConfigured = !!process.env.EMAIL_SMTP; // mock check
        return res.status(200).json({ dbConnected, paymentConfigured, emailConfigured });
    } catch (err) {
        console.error('status endpoint error', err);
        return res.status(500).json({ dbConnected: false, paymentConfigured: false, emailConfigured: false });
    }
});



module.exports = app;