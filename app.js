var createError = require('http-errors');
var express = require('express');
var flash = require('express-flash');
var session = require( 'express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var indexRouter = require('./routes/index');
var passport = require('./routes/passport');
var memoryStore = require('memorystore')(session); // need this super constructor call to express session module.
var constants = require('./model/config/constants');

var app = express();
//console.log("Current Server __dirname is : " + __dirname);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('json spaces', 2);

//TODO:: USE ONLY STATIC FILES FROM DISTRIBUTION BUNDLES AND NOT PUBLIC.
app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/',  express.static(path.join(__dirname, 'public/images')));

//Routes Last.

app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: constants.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  //expire session on server after one day on for now.
  expires: new Date(Date.now() + (1 /*day*/ * 86400 * 1000)),
  cookie: {
    //expire cookie data sent to browser.
    expires: new Date(Date.now() + (1 /*day*/ * 86400 * 1000)),
  },
  store: new memoryStore({
    checkPeriod: 86400000 //expire 24 hours. express default memory store doesnt work.
  }),
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
