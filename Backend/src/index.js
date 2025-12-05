const express = require('express');
const app = express();
const cors = require('cors');
const userRoute = require('../src/Routes/user.route')
const adminRoute = require('../src/Routes/admin.route')
const productRoute = require('../src/Routes/product.route')


app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));

app.use(express.json());

app.use('/api/auth', userRoute);
app.use('/api/auth', adminRoute);
app.use('/api', productRoute);



module.exports = app;