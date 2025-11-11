const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sellerModel = require('../Model/seller.model');


async function registerSeller(req, res){

    const {fullname, shopname, email, password, GST_number, address} = req.body

    console.log("req.body", req.body);

    const isSellerExist = await sellerModel.findOne({ email });

    if(isSellerExist){
        return res.status(401).json({
            message: "User Allready Exist, please loginUser!.."
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newSeller = sellerModel.create({
        fullname: fullname, 
        shopname: shopname, 
        GST_number: GST_number, 
        email: email, 
        password: hashedPassword,
        address: address
    });

    const token = jwt.sign({ id: newSeller._id }, process.env.JWT_SECRET, { expiresIn: '12h' }); 

    res.cookie('token', token);

    return res.status(201).json({
        message: "Seller register successfully!..."
    })
}

async function loginSeller(req, res){
    const {email, password} = req.body;

    const seller = await sellerModel.findOne({ email });

    if(!seller){
        res.status(400).json({
            message: "User not found, Please Enter Valid Cridentials..."
        })
    }

    const isPasswordValid = await bcrypt.compare(password, seller.password);

    if(!isPasswordValid){
        res.status(400).json({
            message: "Invalid Email or Password..."
        })
    }

    const token = jwt.sign({ id: seller._id },process.env.JWT_SECRET, { expiresIn: '12h' });

    res.cookie('token', token);

    return res.status(200).json({
        message: "User logged in successfully",
    });
}


module.exports = {
    registerSeller,
    loginSeller
}