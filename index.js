const express = require("express");
const app = express();
const appConfig = require("./config/appConfig");
let fs = require("fs");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const globaleErrorMiddleware = require("./middleware/appErrorHandler");
const routerLoggerMiddleware = require("./middleware/routeLogger");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

app.use(globaleErrorMiddleware.globalErrorHandler);
app.use(routerLoggerMiddleware.logIp);


app.get("/hello", (req, res) =>{
    console.log("hello");
});


let modelPath = './model';
fs.readdirSync(modelPath).forEach(function(file){
    if(~file.indexOf('.js'))
    console.log(modelPath +'/'+file); 
     require(modelPath +'/'+ file);
})


let routesPath = './routes';
fs.readdirSync(routesPath).forEach(function(file){
    if(~file.indexOf('.js')) {
        console.log("including the following file");
        console.log(routesPath+'/'+file);
        let route = require(routesPath + '/' + file);
        route.setRouter(app);
    }
});


app.use(globaleErrorMiddleware.globalNotFoundHandler);

//port and listen
app.listen(appConfig.port, (req,res) =>{
    console.log("server is runing");
    let db = mongoose.connect(appConfig.db.uri, {useNewUrlParser: true, useUnifiedTopology: true})
})


mongoose.connection.on("error", function(err){
    console.log("database connection error");
    console.log(err);
});


mongoose.connection.on('open', function(err){
    if(err){
        console.log("database error");
        console.log(err);
    } else {
        console.log("database connection open success");
    }
});