const express = require("express");
const userController = require("./../controller/userController");
const apiConfig = require("./../config/appConfig");
const auth = require("./../middleware/authMiddleware");

let setRouter = (app) =>{

    let baseUrl = apiConfig.apiVersion+'/user';
    app.get(baseUrl+'/all', userController.getAllUser);
    app.get(baseUrl+'/:userId/getSingleUser', userController.getWherById);
    app.delete(baseUrl+'/:userId/deleteUser', userController.deleteUser);
    app.put(baseUrl+'/:userId/updateUser', userController.updateUser);
    app.post(baseUrl+'/addUser', userController.singUpFunction);
       
    app.post(baseUrl+'/login', userController.loginFunction);
    app.post(baseUrl+'/logout', auth.isAuthorized, userController.logout);
}

module.exports ={
    setRouter:setRouter
}