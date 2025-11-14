const express = require('express');
const app = express();
const cors = require('cors');
const userRoute = require('../src/Routes/user.route')


app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));

app.use(express.json());

app.use('/api/auth', userRoute);



module.exports = app;