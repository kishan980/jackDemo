
const responseLib = require("./../library/responseLibrary");

/*
let errorHandler =(err, req, res, next) =>{
    console.log("Appliaction error handler called");
    console.log(err);
    res.send("some error occured at globale level");
}

let notFoundHandler = (req,res,next) =>{
    console.log("Golble not found handle called");
    res.status(404).send("Route not found in the application");
}

*/
let errorHandler =(err, req, res, next) =>{
    console.log("Appliaction error handler called");
    console.log(err);
    let apiResponse = responseLib.generate(true, "Some Error occured at golbal level", 500, null);
    // res.send("some error occured at globale level");
    res.send(apiResponse);
}

let notFoundHandler = (req,res,next) =>{
    console.log("Golble not found handle called");
    let apiResponse = responseLib.generate(true, "Route not found in the application", 404, null);
    res.status(404).send(apiResponse);
}


module.exports = {
    globalErrorHandler: errorHandler,
    globalNotFoundHandler: notFoundHandler
}