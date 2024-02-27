const {JWT_SECRET} = require("./config")
const jwt = require("jsonwebtoken");
const { User } = require("./db");

const authmiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({});
    }

    const token = authHeader.split(" ")[1];
    
    try {
        // Checking if the user id exists.
        const decoded = jwt.verify(token, JWT_SECRET)
        console.log(decoded)
        // if we log decode we can see it returns an object with a first element 
        // userId and the second element iat which is the timestamp of the issued 
        // token.. 
        const exists = decoded.userId
        if (exists) {
        // If the userId does exist attach it to the request object..
            req.userId = decoded.userId;
            next();
        } else {
            res.status(411).json({
                message : "wrong inputs!!"
            })
        }
    } 
    
    catch (err) {
        return res.status(411).json({
            message : "wrong authorization header!!"
        })
    }
}

module.exports = {
    authmiddleware
}