// backend/routes/user.js
const express = require('express');
const {authmiddleware} = require("../middleware")
const router = express.Router();
const zod = require("zod");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { Account } = require("../db")

const signupBody = zod.object({
    username: zod.string().email(),
	firstName: zod.string(),
	lastName: zod.string(),
	password: zod.string()
})

router.post("/signup",  async (req, res) => {
    const { success } = signupBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs"
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })
    
    const userId = user._id;

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })
    
    res.json({
        message: "User created successfully",
        token : token
    })
})

const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})

router.post("/signin", async (req, res) => {
    
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });
    
    if (!user) {
        res.status(411).json({
            message: "wrong inputs/ user doesn't exist."
        })
    }

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }
    
})
const updateBody = zod.object({
    password: zod.string().optional(),
    firstName : zod.string().optional(),
    lastName : zod.string().optional()
})

router.put("/", authmiddleware, async (req, res) => {

    const {success} = updateBody.safeParse(req.body);
    if (!success) {
        res.status(411).json({
            message : "Error while updating information."
        })
    }
    
    await User.updateOne({_id : req.userId}, req.body)

    res.json({
        message : "Updated successfully!!"
    })

})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "" ;

    const users = await User.find({
        $or : [{
            firstName : {"$regex" : filter}
    },{
        lastName : {"$regex" : filter}
        }]
    })
    res.json({
        // REASON : the object returned is put inside parantheses so that the compiler 
        // doesn't get confused if it is a function block or an object literal..
        // also this route ultimately returns an object with "users" as an array of 
        // individual objects..
        users : users.map(user => ({
            username : user.username,
            firstName : user.firstName,
            lastName : user.lastName,
            _id : user._id 
        }))
    })
})


module.exports = router;