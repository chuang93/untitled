function isAuthenticated(req, res, next){
    if (req.isAuthenticated())
        return next();
    res.redirect('/user/login');
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