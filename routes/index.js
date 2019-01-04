var express = require('express');
var router = express.Router();
var passport = require('../routes/passport');
var isAuthenticated = require('./routeUtility').isAuthenticated;
//login page
router.get('/login', function(req, res, next) {
    res.render('login', {'message':req.flash('message')}); //render whatever is stored in the flash message.
}).post('/login',
    passport.authenticate('local',
        {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        }));

router.get('/', isAuthenticated, function(req,res,next){
   res.render('index',{'title': 'welcome back logged in user!.'});
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
});

module.exports = router;

