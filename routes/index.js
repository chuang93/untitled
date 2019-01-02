var express = require('express');
var router = express.Router();

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    console.log("Logged in: redirecting to homepage.");
    res.render('index', {title: "Logged In Index Page."});
  } else {
    next();
  }
};
/* GET home page.  redirect to login through session checker if not logged in.*/
router.get('/', sessionChecker, function(req, res, next) {
  //if fail session Checker Callback
  res.redirect('/login');
});

router.get('/login', sessionChecker, function(req, res){
  res.render("index", {title: "Not Logged In"}); //render the html but do not redirect
});

router.get('/logout', function(req, res){
  if(req.cookies.user_sid) {
    res.clearCookie('user_sid');
  }
  res.redirect('/login');
});
module.exports = router;
