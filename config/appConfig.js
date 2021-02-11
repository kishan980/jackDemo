let appConfig ={};

appConfig.port=7878;
appConfig.allowedCorsOrigin="*";
appConfig.env ="dev";
appConfig.db={
    uri:"mongodb+srv://user:user@cluster0.s7bwl.mongodb.net/JackUser?retryWrites=true&w=majority"
};
appConfig.apiVersion="/api/v10";

module.exports ={

    port:appConfig.port,
    allowedCorsOrigin:appConfig.allowedCorsOrigin,
    enviroment: appConfig.env,
    db:appConfig.db,
    apiVersion:appConfig.apiVersion
    
}