const express = require('express');
const sellerAuth = require('../Controller/SellerAuth.controller');

const router = express.Router();


// seller auth APIs
router.post('/seller/register', sellerAuth.registerSeller)
router.post('/seller/login', sellerAuth.loginSeller)

module.exports = router;