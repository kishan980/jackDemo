let generate = (err, message, status, data) =>{
    let response={
        error:err,
        messages:message,
        status:status,
        data:data
    }
    return response;
}

module.exports ={
    generate:generate
}