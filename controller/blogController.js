const express     = require("express");
const mongoose    = require("mongoose");
const shortid     = require("shortid");

const responseLib = require("./../library/responseLibrary");
const logger   = require("./../library/loggerLibrary");
const checkLib    = require("./../library/checkLibrary");

const BlogModel   = mongoose.model("Blog");

let getAllBlog = (req,res) =>{
    BlogModel.find()
        .select('-__v -_id')
        .lean()
        .exec((err, result) =>{
                if(err){
                    console.log(err);
                    logger.error(err.message, "blogControll: getallBlog",10);
                    let apiResponse = responseLib.generate(true, "Failed to find blog Details", 500, null);
                    res.send(apiResponse);
                } else if(checkLib.isEmpty(result)){
                    
                        logger.info("No Blog Found", "BlogController: getAllBlog");
                        let apiResponse = responseLib.generate(true, "no Blog Found", 404, null);
                        res.send(apiResponse);
                } else {
                    let apiResponse = responseLib.generate(false, "All blog Find succesfully", 200, result);
                    res.send(apiResponse);
                }
        });
}

let getViewById = (req,res) =>{
        
        if(checkLib.isEmpty(req.params.blogId)){
            console.log("BlogId shuld be passed");
            let apiResponse = responseLib.generate(true, "BlogId is missing", 403, null);
            res.send(apiResponse);
        } else {
            BlogModel.findOne({"blogId": req.params.blogId}, (err, result) =>{
                if(err){
                    console.log("Error is occured");
                    logger.error(`error Occured:${err}`, "Databse",10);
                    let apiResponse = responseLib.generate(true, "Error is Occured", 500, null);
                    res.send(apiResponse);
                // } else if(result == undefined || result == null || result == ''){
                }else if(checkLib.isEmpty(result)){
                    console.log("blog not found");
                    let apiResponse = responseLib.generate(true, "blog not found", 500, null);
                   res.send(apiResponse);
                } else {
                    loggerLib.info("blog found succefully", "blogController: viewById", 5);
                    let apiResponse = responseLib.generate(false, "blog Found succefully", 200, result);
                    res.send(apiResponse);
                }
            });
        }
}

let deleteBlog = (req,res) =>{

    if(checkLib.isEmpty(req.params.blogId)){
        console.log("blogId should be passed");
        let apiResponse = responseLib.generate(true, "blogId is missing", 403, null);
        res.send(apiResponse);
    } else {

        BlogModel.remove({"blogId": req.params.blogId}, (err, result) =>{
            if(err){
                console.log("Error is occured");
                logger.error(`Error Occured ${err}`, "Database",10);
                let apiResponse = responseLib.generate(true, "Error Occured", 500, null);
                res.send(apiResponse);
           
            } else if(checkLib.isEmpty(result)){
                console.log("No BlogId Found");
                let apiResponse = responseLib.generate(true, "Blog not found", 404, null);
                res.send(apiResponse);
               
            } else {
                logger.info("blog delete successfully");
                let apiResponse = responseLib.generate(false, "succefully delete blog one records..", result);
                res.send(apiResponse);
            }
        });
    }
}

let updateBlog = (req,res) =>{

        if(checkLib.isEmpty(req.params.blogId)){
            console.log("blogId should be passed");
            let apiResponse = responseLib.generate(true, "blogId is missing", 403);
            res.send(apiResponse);
        } else{
            let options = req.body;
            console.log(options);
            BlogModel.update({"blogId":req.params.blogId} ,options, {multi:true}).exec((err, result)=>{
                
                if(err){
                    console.log("Error is Occured");
                    logger.error(`Error is occured:${err}`, 'Database',10);
                    let apiResponse = responseLib.generate(true, "Error Ocuured", 500, null);
                    res.send(apiResponse);
                } else if(checkLib.isEmpty(result)) {
                    console.log("No BlogId Found");
                    let apiResponse =responseLib.generate(true, "Blog not found", 404, null);
                    res.send(apiResponse);
                 
                } else {
                    console.log("Blog Edited SuccessFully");
                    let apiResponse = responseLib.generate(false, "Blog Edited SuccessFully", 200, result);
                    res.send(apiResponse);
                }
            })
        }
}

let createBlog = (req, res) =>{
    let blogCreationFunction = ()=>{
        return new Promise((resolve, reject) =>{

            console.log(req.body);
            if(checkLib.isEmpty(req.body.blogQuestion) ||
                checkLib.isEmpty(req.body.blogAnswer)){
                        console.log("403, forbidden request");
                        let apiResponse = responseLib.generate(true, "required parameter is missing", 403, null);
                        res.send(apiResponse);
                } else {
                    var today = Date.now();
                    let blogId = shortid.generate();
                
                    let newBlog = new BlogModel({
                        blogId:blogId,
                        blogQuestion: req.body.blogQuestion,
                        blogAnswer: req.body.blogAnswer,
                     
                        created: today,
                        updated:today
                    });
                
                                newBlog.save((err, result) =>{
                                    if(err){
                                        console.log("Error Occured");
                                        logger.error(`Error Ocuured ${err}`, 'Database', 10);
                                        let apiResponse = responseLib.generate(true, "Error is occured check all column", 500, null);
                                        reject(apiResponse);
                                    } else {
                                        let apiResponse = responseLib.generate(false, "Blog add succefully", 200, result);
                                        resolve(apiResponse);
                                    }
                                })
                }   
        })
    }

    blogCreationFunction()
        .then((result) =>{
            let apiResponse = responseLib.generate(true, "blog is add succefully", 200, result);
            res.send(apiResponse);
        })
        .catch((error) =>{
            console.log(error);
            res.send(error);
        })
    
}

module.exports ={
    
    getAllBlog:getAllBlog,
    getViewById:getViewById,
    deleteBlog:deleteBlog,
    updateBlog:updateBlog,
    createBlog:createBlog,

}