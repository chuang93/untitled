var express = require('express');
var router = express.Router();
var passport = require('../routes/passport');
//login page
router.get('/login', function(req, res, next) {
    res.render('login', {'message':req.flash('message')}); //render whatever is stored in the flash message.
}).post('/login', function(req, res, next) {
    console.log(req.url);
    console.log("username: " + req.body.username);
    console.log("password:" + req.body.password);
    passport.authenticate('local', function(err, user, info) {
        if(err){
            console.log("done(err) | err: ");
            console.log(err);
            res.redirect('/login');
        }
        else if(!user){
            console.log("login error for " + req.body.username + " | " + req.body.password);
            res.redirect('/login');
        }else{
            console.log("user found: " + user);
            res.redirect('/login');
        }
    })(req, res, next);
});
module.exports = router;

