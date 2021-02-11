const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let BlogSchema = new Schema({

    blogId:{
        unique:true,
        type:String 
    },
    blogQuestion:{
        type:String,
        required:true,
        unique:true
    },
    blogAnswer:{
        type:String,
        required:true,
        default:0
    },
    
    created:{
        type:Date,
        default:Date.now
    },
    updated:{
        type:Date,
        default:Date.now
    }

});
mongoose.model('Blog', BlogSchema);