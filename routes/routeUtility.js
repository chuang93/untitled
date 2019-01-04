function isAuthenticated(req, res, next){
    console.log("Authenticating session from request: '" + req.url + "'");
    if (req.isAuthenticated())
        return next();
    console.log("request is not authenticated, please log in again");
    res.redirect('/login');
}
function checkStatus(res) {
    if (res.status === 200 ) {
        return res;
    } else {
        throw Error(res.statusText);
    }
}
module.exports = {
    isAuthenticated: isAuthenticated,
    checkStatus: checkStatus,
};