// backend/db.js

const mongoose = require("mongoose");


mongoose.connect("You're mongoDB url here");

// creating a mongoose schema
/* 
    this is a simple solution
*/

// const userschema = new mongoose.Schema({
//     userame: String, 
//     password: String,
//     first_name: String,
//     last_name: String
// })

// More elegant solution

const userschema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },

    password : {
        type: String,
        required: true,
        minLength: 6
    },
   
    firstName : {
        type: String,
        required: true,
        trim: true,        
        maxLength: 30,
       
    },

    lastName : {
        type: String,
        required: true,
        trim: true,  
        maxLength: 30
    }
})

const accountSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId, // reference to user Schema
        ref : "User",
        required : true
    },
    balance :  {
        type : Number,
        required: true
    }
})

// Creating a model from the schema :

const User = mongoose.model("User", userschema);
const Account = mongoose.model("Account", accountSchema);

module.exports = {
    User,
    Account
}