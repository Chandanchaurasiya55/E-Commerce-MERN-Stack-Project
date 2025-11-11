const userdata = require('../Controller/auth.controller');
const userModel = require('../Model/user.model');


async function authenticateUser(res, req, next){

    const token = res.cookie.token;

    if(!token){
        res.status(401).json({
            Message: "please login first!..."
        })
    }

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        req.user = user
        next()

    }
    catch(err){
        return res.status(401).json({
            message: "Invalid token"
        })

    }
}



