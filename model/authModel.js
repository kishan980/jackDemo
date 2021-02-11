const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const time = require("./../library/timeLibrary");

const AuthSchema = new Schema({

        userId:{
            type:String,
            unique:true
        },
        authToken:{
            type:String
        },
        tokenSecret:{
            type:String
        },
        tokenGenerationTime:{
            type:Date,
            default:time.now()
        }

});

module.exports = mongoose.model("Auth", AuthSchema);