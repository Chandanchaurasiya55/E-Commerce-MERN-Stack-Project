const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    Fullname: {
        type: String,
        required: true,
        trim: true
    },
    Email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    Password: {
        type: String,
        minlength: 8
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


const userModel = mongoose.model("User", userSchema);

module.exports = userModel;