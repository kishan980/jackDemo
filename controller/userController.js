const express = require("express");
const mongoose = require("mongoose");
const shorid = require("shortid");
const check = require("./../library/checkLibrary");
const response = require("./../library/responseLibrary");
const logger = require("./../library/loggerLibrary");
const validateInput = require("./../library/paramsValidationLibrary");
const passwordLibrary = require("./../library/generatePasswordLibrary");
const tokenLibrary = require("./../library/token");
const time = require("./../library/timeLibrary");
const UserModel = mongoose.model("user");
const AuthModel = mongoose.model('Auth')

// let helloworldFunction = (req,res)=>res.send("hello");
// let printExmaple = (req,res)=>res.send("print exmaple");

let getAllUser = (req,res)=>{

    UserModel.find()
        .select('-__v -_id')
        .lean()
        .exec((err, result) =>{
            if(err){
                console.log(err);
            } else if(check.isEmpty(result)){
                logger.error("not found userDetails", "userController: getAllUser()",10);
                let apiResponse = response.generate(true, "not found userDetails",404, null);
                res.send(apiResponse);
            } else {
                logger.info("successFully userDetails Found", "userController: getAllUser()",10);
                let apiResponse = response.generate(true, "successFully userDetails Found",200, result);
                res.send(apiResponse);
            }
        })

}


let getWherById =(req,res) =>{
    
    if(check.isEmpty(req.params.userId)){
        console.log("userId passed please");
        let apiResponse = response.generate(true,"userId  missing", 403, null);
        res.send(apiResponse);
    } else {

        UserModel.findOne({"userId": req.params.userId}, (err, result)=>{
            if(err){
                console.log(err);
                logger.error(err.message, "userController:getWhereById()")
                let apiResponse = response.generate(true, "userId passed",500, null);
                res.send(apiResponse);
            } else if(check.isEmpty(result)){
                logger.error("not found userId","userController:getWhereById()",10);
                let apiResponse = response.generate(true, "not found userId", 404, null);
                res.send(apiResponse);
            } else {
                logger.info("find UserWhereById suucessFully", "userController:getWhereById()");
                let apiResponse = response.generate(false, "find UserWhereById suucessFully", 200, result);
                res.send(apiResponse);
            }
        })

    }
} 

let deleteUser = (req, res) =>{

    if(check.isEmpty(req.params.userId)){
        console.log("plaese enter userId");
        let apiResponse = response.generate(true, "userId missing", 403, null);
        res.send(apiResponse);
    } else {
        UserModel.remove({"userId": req.params.userId}, (err, result)=>{
            
            if(err){
                console.log(err);
                logger.error(err.message, "userController:deleteUser()")
                let apiResponse = response.generate(true, "userId passed",500, null);
                res.send(apiResponse);
            } else if(check.isEmpty(result)){
                logger.error("not found userId","userController:deleteUser()",10);
                let apiResponse = response.generate(true, "not found userId", 404, null);
                res.send(apiResponse);
            } else {
                logger.info("successFully delete userDetails One Recoreds", "userController:deleteUser()");
                let apiResponse = response.generate(false, "successFully delete userDetails One Recoreds", 200, result);
                res.send(apiResponse);
            }
        });
    }
}

let updateUser = (req,res) =>{
    if(check.isEmpty(req.params.userId)){
        console.log("plaese enter userId");
        let apiResponse = response.generate(true, "userId missing", 403, null);
        res.send(apiResponse);
    } else {
        let options = req.body;
        UserModel.update({"userId": req.params.userId}, options, {multi:true}, (err, result)=>{

            if(err){
                console.log(err);
                logger.error(err.message, "userController:updateUser()")
                let apiResponse = response.generate(true, "userId passed",500, null);
                res.send(apiResponse);
            } else if(check.isEmpty(result)){
                logger.error("not found userId","userController:updateUser()",10);
                let apiResponse = response.generate(true, "not found userId", 404, null);
                res.send(apiResponse);
            } else {
                logger.info("successFully update userDetails One Recoreds", "userController:updateUser()");
                let apiResponse = response.generate(false, "successFully update userDetails One Recoreds", 200, result);
                res.send(apiResponse);
            }
        })
    }
}

let singUpFunction =(req,res) =>{
    
    let validateUserInput = () =>{
        return new Promise((resolve, reject) =>{
        if(req.body.userEmail) {
                if(!validateInput.Email(req.body.userEmail)) {
                    let apiResponse = response.generate(true,"Email Does not meet the requiredmenet", 400, null);
                    reject(apiResponse);
                } else if(check.isEmpty(req.body.userPassword)) {
                    let apiResponse = response.generate(true, "Password parameter is missing", 400, null);
                    reject(apiResponse);
                } else {
                    resolve(req);
                }
            } else {
                logger.error("Field Missing During User Create","userController: createUser()",5);
                let apiResponse = response.generate(true, "One or More Parameter(s) is Missing",400, null);
                reject(apiResponse);
            }

        });
    }

    let createUser = () =>{
        return new Promise((resolve, reject) =>{
            UserModel.findOne({userEmail: req.body.userEmail})
              .exec((err, retrieveUserDetails) =>{
                  if(err){
                    loggerLibrary.error(err.messsag, "userController: createUser",10);
                    let apiResponse = response.generate(true, "Failed To created user",500,null);
                    reject(apiResponse);
                  } else if(check.isEmpty(retrieveUserDetails)) {
                        console.log(req.body);
                                        
                        let newUser = new UserModel({
                            userId: shorid.generate(),
                            userName: req.body.userName,
                            userEmail: req.body.userEmail.toLowerCase(),
                            userMobileNumber: req.body.userMobileNumber,
                            userPassword: passwordLibrary.hashpassword(req.body.userPassword),
                            createdOn: time.now(),
                            updateAt: time.now()
                        });

                        newUser.save((err, newUser) =>{
                            if(err) {
                                console.log(err);
                                loggerLibrary.error(err.message, "userController: createUser",10);
                                let apiResponse = response.generate(true, "Failed to create new user", 500, null);
                                reject(apiResponse);
                            } else {
                                let newUserObj = newUser.toObject();
                                resolve(newUserObj);
                            }
                        });
                  } else {
                        logger.error("User Cannot Be Created.User Already Present", "userController: createUser",4);
                        let apiResponse = response.generate(true, "User Already Present With this Email", 403, null);
                        reject(apiResponse);
                  }
              })  
        })
    }

    validateUserInput(req, res)
        .then(createUser)
        .then((resolve) =>{
            delete resolve.password
            let apiResponse = response.generate(false, "User created", 200, resolve);
            res.send(apiResponse);
        })
        .catch((err) =>{
            console.log(err);
            res.send(err);
        })

}

// start of login function 
let loginFunction = (req, res) => {
    let findUser = () => {
        console.log("findUser");
        return new Promise((resolve, reject) => {
            if (req.body.userEmail) {
                console.log("req body email is there");
                console.log(req.body);
                UserModel.findOne({ userEmail: req.body.userEmail}, (err, userDetails) => {
                    /* handle the error here if the User is not found */
                    if (err) {
                        console.log(err)
                        logger.error('Failed To Retrieve User Data', 'userController: findUser()', 10)
                        /* generate the error message and the api response message here */
                        let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                        reject(apiResponse)
                        /* if Company Details is not found */
                    } else if (check.isEmpty(userDetails)) {
                        /* generate the response and the console error message here */
                        logger.error('No User Found', 'userController: findUser()', 7)
                        let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                        reject(apiResponse)
                    } else {
                        /* prepare the message and the api response here */
                        logger.info('User Found', 'userController: findUser()', 10)
                        resolve(userDetails)
                    }
                });
               
            } else {
                let apiResponse = response.generate(true, '"email" parameter is missing', 400, null)
                reject(apiResponse)
            }
        })
    }
    let validatePassword = (retrievedUserDetails) => {
        console.log("validatePassword");
        return new Promise((resolve, reject) => {
            passwordLibrary.comparePassword(req.body.userPassword, retrievedUserDetails.userPassword, (err, isMatch) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Login Failed', 500, null)
                    reject(apiResponse)
                } else if (isMatch) {
                    let retrievedUserDetailsObj = retrievedUserDetails.toObject()
                    delete retrievedUserDetailsObj.password
                    delete retrievedUserDetailsObj.userPhoto
                    delete retrievedUserDetailsObj._id
                    delete retrievedUserDetailsObj.__v
                    delete retrievedUserDetailsObj.createdOn
                    delete retrievedUserDetailsObj.modifiedOn
                    resolve(retrievedUserDetailsObj)
                } else {
                    loggerLibrary.info('Login Failed Due To Invalid Password', 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Wrong Password.Login Failed', 400, null)
                    reject(apiResponse)
                }
            })
        })
    }

    let generateToken = (userDetails) => {
        console.log("generate token");
        return new Promise((resolve, reject) => {
            tokenLibrary.generateToken(userDetails, (err, tokenDetails) => {
                if (err) {
                    console.log(err)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else {
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    resolve(tokenDetails)
                }
            })
        })
    }
    let saveToken = (tokenDetails) => {
        console.log("save token");
        return new Promise((resolve, reject) => {
            AuthModel.findOne({ userId: tokenDetails.userId }, (err, retrievedTokenDetails) => {
                if (err) {
                    console.log(err.message, 'userController: saveToken', 10)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(retrievedTokenDetails)) {
                    let newAuthToken = new AuthModel({
                        userId: tokenDetails.userId,
                        authToken: tokenDetails.token,
                        tokenSecret: tokenDetails.tokenSecret,
                        tokenGenerationTime: time.now()
                    })
                    newAuthToken.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                } else {
                    retrievedTokenDetails.authToken = tokenDetails.token
                    retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret
                    retrievedTokenDetails.tokenGenerationTime = time.now()
                    retrievedTokenDetails.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                }
            })
        })
    }

    findUser(req,res)
        .then(validatePassword)
        .then(generateToken)
        .then(saveToken)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Login Successful', 200, resolve)
            res.status(200)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log("errorhandler");
            console.log(err);
            res.status(err.status)
            res.send(err)
        })
}

let logout = (req,res) =>{

    AuthModel.findOneAndRemove({userId:req.params.userId}, (err, result) =>{
        if(err) {
            console.log(err);
            logger.error(err.message, "userController: logout",10);
            let apiResponse = response.generate(true, `error Ocuured ${err.message}`, 500, null);
            res.send(apiResponse);
        } else if(check.isEmpty(result)){
            let apiResponse = response.generate(true, "Already Logged out or Invalide UserId", 404, null);
            res.send(apiResponse);
        } else {
            let apiResponse = response.generate(false, "Logged Out Succeffully", 200, null);
            res.send(apiResponse);
        }
    })
}

module.exports={

    getAllUser:getAllUser,
    getWherById:getWherById,
    deleteUser:deleteUser,
    updateUser:updateUser,
    singUpFunction:singUpFunction,
    loginFunction:loginFunction,
    logout:logout
    // helloworldFunction:helloworldFunction,
    // printExmaple:printExmaple
}