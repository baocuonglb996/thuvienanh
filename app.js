var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path');
var passport = require('passport');
var flash = require('connect-flash');

var LocalStrategy = require('passport-local').Strategy;
var configDB = require('./model/database');
mongoose.Promise = global.Promise;
mongoose.connect(configDB.url,{ useMongoClient: true });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.set('view options', { layout:'layout.ejs' });

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'somethinghere', resave: false, saveUninitialized: false}));
app.use(flash()); 
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

var index = require('./routes/index');
var user = require('./controllers/user');
var login = require('./controllers/login');
var admin = require('./controllers/admin');


app.use('/', index);
app.use('/admin',admin);
app.use('/user', user);
app.use('/login',login);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
