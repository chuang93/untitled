var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require("crypto");
var constants = require('../model/config/constants');
var connection = require('../model/config/dbconn');
var fetch = require('node-fetch');
var routeUtility = require('../routes/routeUtility');
var { URLSearchParams } = require('url');

function getEncPassword(password){
    const salt = constants.SALT;
    salted = salt+password;
    const encPassword = crypto.createHash('sha1').update(salted).digest('hex');
    return encPassword;
}

function PassportUser(id, firstName, lastName, username, email, createTime){
    //dont need all of these fields to identify and deserialize a user later, but keep for now for logging purposes.
    this.id = id;
    this.firstName= firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email;
    this.createTime = createTime;
}
//store in the passport session based on user id
passport.serializeUser(function(user, done) {
    //don't use this object, gets stored as req.session.passport.user at end of request.
    console.log('serializing user data into id: ' + user.id);
    done(null, new PassportUser(user.id, user.first_name, user.last_name, user.username, user.email, user.create_time));
});

passport.deserializeUser(function(user, done){
    //stores deserialized object in req.user when authenticated session request comes in, and is processes by first passport.initialize()
    //which invokes passport.session().
    //TODO:CONSIDER REFACTORING TO QUERY FROM THE SERVICES LAYER INSTEAD AND REMOVE MYSQL DRIVER FROM NODE.
    const query = 'select * from ' + constants.MYAPP_SCHEMA + '.' + constants.MYAPP_LOCAL_USER +  ' where id = '+ user.id;
    console.log(query);
    connection.query(query, function (err, rows){
        if(err){
            console.log("deserialize error: " + err.message);
            done(err);
        }else{
            console.log("user deserialized from session id " + user.id);
            done(err, rows[0]);
        }
    });
});
passport.use('localLogin', new LocalStrategy({
    usernameField: 'username', //if not supplied it will default to these values anyway.
    password:'password',
    //pass whole request if you want other parameters passes back too.
    passReqToCallback: true
}, function(req, username, password, done) {
    console.log(username);
    console.log(password);
    if(req.isAuthenticated()){
        let loggedInMessage = username + "already logged in, please log out first.";
        console.log(loggedInMessage);
        return done(null, false, req.flash)
    }
    console.log("authenticating with Local Strategy, input username/password: " + username + " | " + password);
        if (!username || !password) {
            console.log("user pass missing");
            return done(null, false, req.flash('message', 'username or password missing'));
        }
        //TODO::CHANGE TO USE JAVA SERVICE API.
        connection.query("select * from myappdb.local_user where username = ?", [username], function (err, rows) {
            if(err){
                console.log("select query error: " + err);
                return done(err);
            }
            console.log("rows selected: " + rows.length);
            if(!rows.length)
            {
                console.log("username not found in database: " + username);
                return done(null, false, req.flash('message', 'Username not found in database.'));
            }
            var encPassword = getEncPassword(password);
            var dbPassword = rows[0].password;
            if(!(dbPassword === encPassword)){
                console.log("input password (encrypted): " + encPassword + " doesnt match password for user: " + rows[0].user)
                console.log("expected password: " + dbPassword);
                return done(null, false, req.flash('message', 'Submitted password does not match password stored for user: ' + username));
            }else{
                //if all checks pass then return the user with this strategy.
                console.log("passport authenticate success for user: " + rows[0].username);
                const user = new PassportUser(rows[0].id, rows[0].first_name, rows[0].last_name, rows[0].username, rows[0].email, rows[0].create_time);
                return(done(null, user));
            }
        })
    }
));
//local signup
passport.use( 'localSignup', new LocalStrategy({
        passReqToCallback : true
}, function(req, username, password, done) {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const passwordConfirm = req.body.passwordConfirm;
        const name = firstName + ' ' + lastName;
        console.log('Name: ' + name + ' | email: ' + email);
        if (!username || !password || !firstName || !lastName || !email || !passwordConfirm) {
            console.log("signup params missing");
            return done(null, false, req.flash('message', 'All fields required to sign up'));
        } else if(password !== passwordConfirm){
            console.log("Password confirm not the same as password");
            return done(null, false, req.flash('message', 'Password does not match the confirm password.'));
        } else {
            const encPassword = getEncPassword(password);
            const params = new URLSearchParams();
            params.append('firstName', firstName);
            params.append('lastName', lastName);
            params.append('username', username);
            params.append('password', encPassword);
            params.append('email', email);
            fetch(constants.MYAPPSERVICES + "user/signup",
                {
                    method: 'POST',
                    body: params
                }
            ).then(routeUtility.handleErrors)
                .then(function (res) {
                    return (res.json());
                }).then(function (json) {
                console.log(json);
                return done(null, new PassportUser(json.id, json.first_name, json.last_name, json.username, json.email, json.create_time))
            }).catch(function (err) {
                console.log(err);
                if(err.message.includes("Conflict")){
                    return done(null, false, req.flash('message', 'email ' + email + ' or username ' + username + ' already exists.'));
                }
                return done(null, false, req.flash('message', 'Internal Server Error: ' + err.message));
            });
        }
    }
));

module.exports = passport;