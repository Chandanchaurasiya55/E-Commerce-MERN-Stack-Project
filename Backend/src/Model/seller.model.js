const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    fullname: {
        type: String,
        require: true,
        trim: true
    },
    shopname:{
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    email:{
        type: String,
        unique: true,
        require: true,
        trim: true
    },
    password:{
        type: String,
        require: true
    },
    GST_number: {
        type: String,
        unique: true,
        require: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
     createdAt: {
        type: Date,
        default: Date.now   // Automatically current date/time set karega
    }   
},
    {
        timestamp: true
    }
)

const sellerModel = mongoose.model("Seller", sellerSchema);

module.exports = sellerModel;