var createError = require('http-errors');
var express = require('express');
var uuid = require('uuid');
var session = require( 'express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();

console.log("Current Server __dirname is : " + __dirname);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('json spaces', 2);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));

app.use(session({
  genid: function(req){
    return uuid();
  },
  secret: 'mynodeappsecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000
  }
}));
//Clear cookie if the session doesnt exist anymore (must be initialized AFTER cookieparser()
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    console.log("cookie user SID exists, session does not, clearing cookie.");
    res.clearCookie('user_sid');
  }
  next();
});

//ONLY ONE PARAMTER PASSED IN will default the first path parameter to '/'.
//TODO:: USE ONLY STATIC FILES FROM DISTRIBUTION BUNDLES AND NOT PUBLIC.
app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);

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
