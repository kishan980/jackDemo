const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let userSchema = new Schema({

        userId:{
            type:String,
            unique:true
        },
        userName:{
            type:String,
            require:true
        },
        userEmail:{
            type:String,
            require:true
        },
        userPassword:{
            type:String,
            require:true
        },
        userMobileNumber:{
            type:String,
            require:true
        },
        createdOn:{
            type:Date,
            default:Date.now()
        },
        updatedAt:{
            type:Date,
            default:Date.now()
        }
});

mongoose.model("user", userSchema);