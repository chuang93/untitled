function isAuthenticated(req, res, next){
    console.log("Authenticating session from request: '" + req.url + "'");
    if (req.isAuthenticated())
        return next();
    console.log("request is not authenticated, please log in again");
    res.redirect('/login');
}
// authentication handler for sign in route only
function isAuthenticatedLogin(req,res,next){
    if(req.isAuthenticated()){
        console.log("Session Already authenticated for user: " + req.user.username);
        req.flash('message', 'The user: ' + req.user.username + ' is already logged in, please logout first.');
        res.redirect('/login');
    }else{ return next(); }
}
function handleErrors(res) {
    if (res.ok) {
        return res;
    } else { throw Error(res.statusText); }
}
module.exports = {
    isAuthenticated: isAuthenticated,
    handleErrors: handleErrors,
    isAuthenticatedLogin: isAuthenticatedLogin
};
