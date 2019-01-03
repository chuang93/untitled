var express = require('express');
var router = express.Router();
var util = require("util");
var fetch = require("node-fetch");
var routeUtility = require("./routeUtility");
var constants = require("../public/javascripts/Constants");
// middleware function to check for logged-in users
var sessionChecker = function(req, res, next) {
  if(req.session)
  {
      console.log("Session ID: " + req.session.id);
      if (req.session.key) {
          console.log("Session and Key already exist, redirecting to homepage :)");
          res.render('index', {title: "Welcome Back: " + req.session.key.email});
      } else {
          console.log("Session Key not populated with user info, please login first.");
          res.render('index', {title: "Please Log In to access full features."});
      }
  }else{
      //THIS CONDITION NEVER SEEMS TO PASS, WHEN YOU DESTROY THE SESSION IT SEEMS TO AUTOMATICALLY RECREATE.
      console.log("No session exists, creating a fresh session.");
      req.session.regenerate(req, function(err){
         if(err){
             console.log("error regenerating session: " + err);
         } else{
             console.log("Created Fresh Session, please login to authenticate.");
         }
         res.render('index', {title:"Please Log In to access full features."});
      });
  }
};
//Not logged in homepage
router.get('/', sessionChecker, function(req, res, next) {
  //if fail session Checker Callback

  res.render('index', {title: "Please Log in to edit!"});
});

router.get('/login', sessionChecker, function(req, res){
  res.render("index", {title: "Not Logged In"}); //render the html but do not redirect
}).post('/login', function(req, res){
  //util inspect is very verbose, need to comment the below line when not using.
  //console.log(util.inspect(req, false, null, true /* enable colors */));
  //Send this ID token to java backend and use GoogleVerifier to generate user info for validation there
  verifyURL = constants.SERVICES_URL + "verify";
  idToken = req.body.idtoken;
  //if you want to use query params you need to set the header type to this.
  fetch(verifyURL,
      {
          method: 'POST',
          body: "idtoken=" + idToken,
          headers: { 'Content-type': 'application/x-www-form-urlencoded' }
      })
      .then(function(response){
        checkStatus(response);
        response.json().then(function (json){
            req.session.key = json; //store all session variables in key object. When session deletes this object is deleted too.
            console.log("new session key: ");
            console.log(json);
            delete json.token;
            //store user variables here, no need to send info back to the client.
            res.status(200).json(routeUtility.getResponseJson(false, "Successfully Authenticated this session :)."));
        });
      })
      .catch(function(err){
        response.status(500).json(routeUtility.getResponseJson(true, "Internal Server error authenticating this session."));
      });

});

router.get('/logout', function(req, res){
  if(req.session.key) {
    req.session.destroy(function(err){
        if(err){
            console.log("error destroying session key");
        } else{
            console.log("session successfully destroyed");
            res.redirect('/');
        }
    });
  }else{
      console.log("no session to destroy, going to login page.");
      res.redirect('/');
  }
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
