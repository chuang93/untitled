var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require("crypto");
var constants = require('../model/config/constants');
var connection = require('../model/config/dbconn');

//store in the passport session based on user id
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

//get from the passport session based on user id.
passport.deserializeUser(function(id, done){

    connection.query("select * from tbl_users where id = "+ id, function (err, rows){
        //return the rows[0] object with mysql module which returns the user object.
        done(err, rows[0]);
    });
});
passport.use('local', new LocalStrategy({
    usernameField: 'username',
    password:'password',
    //pass whole request if you want other parameters passes back too.
    passReqToCallback: true
}, function(req, username, password, done) {
        if (!username || !password) {
            console.log("user pass missing");
            return done(null, false, req.flash('message', 'username or password missing'));
        }
        let salt = constants.SALT;
        connection.query("select * from LocalUser where username = ?", [username], function (err, rows) {
            if(err){
                console.log("select query error: " + err);
            }
            console.log("rows selected: " + rows.length);
            if(!rows.length)
            {
                console.log("username not found in database: " + username);
                return done(null, false, req.flash("Username not found in database."));
            }
            salt = salt + password;
            var encPassword = crypto.createHash('sha1').update(salt).digest('hex');
            var dbPassword = rows[0].password;
            if(!dbPassword === encPassword){
                console.log("input password (encrypted): " + encPassword + " doesnt match password for user: " + rows[0].user);
                return done(null, false, req.flash('message', 'Submitted password does not match password stored for user.'));
            }
            //if all checks pass then return the user with this strategy.
            console.log("passport authenticate success for user: " + rows[0].username);
            return(done(null, rows[0]));
        })
    }
));
module.exports = passport;