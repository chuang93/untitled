var express = require('express');
var router = express.Router();
var passport = require('../routes/passport');
var routeUtility = require('./routeUtility');
//login page
router.post('/signup', routeUtility.isAuthenticatedLogin,
    passport.authenticate('localSignup',
        {
            successRedirect:'/',
            failureRedirect:'/login',
            failureFlash: true
        })
);

router.get('/login', function(req, res, next) {
    res.render('login', {'message':req.flash('message')}); //render whatever is stored in the flash message.
}).post('/login', routeUtility.isAuthenticatedLogin,
    passport.authenticate('localLogin',
        {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        }));

router.get('/', routeUtility.isAuthenticated, function(req,res,next){
   res.render('index',{'title': 'welcome back logged in user!.'});
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/lisAuthenticatedLoginogin');
});


module.exports = router;

