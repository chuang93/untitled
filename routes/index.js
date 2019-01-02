var express = require('express');
var router = express.Router();
var util = require("util");
var fetch = require("node-fetch");
var constants = require("../public/javascripts/Constants");
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
}).post('/login', function(request, response){
  //util inspect is very verbose, need to comment the below line when not using.
  //console.log(util.inspect(req, false, null, true /* enable colors */));
  //Send this ID token to java backend and use GoogleVerifier to generate user info for validation there
  verifyURL = constants.SERVICES_URL + "verify";
  idToken = request.body.idtoken;
  //if you want to use query params you need to set the header type to this.
  fetch(verifyURL,
      {
          method: 'POST',
          body: "idtoken=" + idToken,
          headers: { 'Content-type': 'application/x-www-form-urlencoded' }
      })
      .then(function(res){
        checkStatus(res);
        res.json().then(function (json){
            console.log(json);
            delete json.token;
            response.status(200).json(json);
        });
      })
      .catch(function(err){
        response.status(500).send("Backend Services Error:" + err);
      });

});

router.get('/logout', function(req, res){
  if(req.cookies.user_sid) {
    res.clearCookie('user_sid');
  }
  res.redirect('/login');
});

function checkStatus(res) {
  if (res.status === 200 ) {
    return res;
  } else {
    console.log("error in validate token on server side, response code was not OK");
    throw Error(res.statusText);
  }
}

module.exports = router;
