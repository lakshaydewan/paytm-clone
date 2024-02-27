const express = require("express");
const { authmiddleware } = require("../middleware");
const { Account } = require("../db");
const router = express.Router();

router.get("/balance", authmiddleware, async(req, res) => {
    const account = await Account.findOne({
        userId : req.userId
    })
    console.log(account.balance)
    res.json({
        message: account.balance
    })
})


router.post("/transfer", authmiddleware, async(req, res) => {
    const {amount, to} = req.body

    const account = await Account.findOne({
        userId : req.userId
    })

    if (account.balance < amount) {
        return res.status(400).json({
            message: "Insufficient balance"
        })
    }

    const toAccount = await Account.findOne({
        userId : to
    })

    if(!toAccount) {
        res.status(411).json({
            message : "Invalid account!"
        })
    }

    await Account.updateOne({
        userId: req.userId
    }, {
        $inc: {
            balance: -amount
        }
    })

    await Account.updateOne({
        userId: to
    }, {
        $inc: {
            balance: amount
        }
    })

    res.json({
        message : "Transfer successful!!"
    })

})

module.exports = router;