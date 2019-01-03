const getResponseJson = function(isError, message){
    return {
        error: isError,
        message: message,
    }
};

module.exports.getResponseJson = getResponseJson;