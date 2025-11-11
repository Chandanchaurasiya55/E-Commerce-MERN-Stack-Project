const usermodel = require('../Model/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



async function registerUser(req, res){

    const { Fullname, Email, Password } = req.body;

    const isUserExist = await usermodel.findOne({
        Email
    });

    if(isUserExist) {
        return res.status(400).json({
            message: "User already exists, Please login"
       });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const newuser = await usermodel.create({
        Fullname: Fullname,
        Email: Email,
        Password: hashedPassword
    });

    const token = jwt.sign({ id: newuser._id }, process.env.JWT_SECRET, { expiresIn: '12h' }); //token generated and valid for 12 hours

    res.cookie('token', token);
       
    return res.status(201).json({
        message: "User registered successfully",
        user: {
            Email,
            Fullname,
        }
    })

}

const loginUser = async (req, res) => {
    const { Email, password } = req.body;

    const user = await usermodel.findOne({ Email: Email });

    if (!user) {
        return res.status(400).json({
            message: "Invalid Email or Password..."
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.Password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid Email or Password..."
        });
    }

    const token = jwt.sign({ id: user._id },process.env.JWT_SECRET, { expiresIn: '12h' });

    res.cookie('token', token);

    return res.status(200).json({
        message: "User logged in successfully",
    });
};



module.exports = {
    registerUser,
    loginUser
}