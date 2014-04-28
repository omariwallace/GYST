/**
 * Module dependencies *
**/

var express = require('express');
var user_routes = require('./routes/user');
var http = require('http');
var path = require('path');
// swig documentation ==> http://paularmstrong.github.io/swig/docs/#express
var swig = require('swig');
require('./controllers/filters.js')(swig); // passing in swig object through the filters via node module

var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var gapi = require('./lib/gapi');

// For running ultrahook process along with app;
var cp = require('child_process');
var spawn = cp.spawn;

var app = express();

// all environments
app.engine('html', swig.renderFile);

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
swig.setDefaults({ cache: false });

app.use(express.favicon());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.logger('dev'));
app.use(express.bodyParser());  // necessary for express.session to work
app.use(express.methodOverride());

// For persistent login sessions (recommended)
app.use(express.cookieParser("test_secret")); // necessary for express.session to work
app.use(express.session());

// Connecting Passport middleware for user auth
app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
// if ('development' == app.get('env')) {
//   app.use(express.errorHandler());
// }


// App Configuration
app.configure('development', function(){
  console.log("THIS is DEVELOPMENT!!");
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  console.log('THIS is PRODUCTION!');
  app.use(express.errorHandler());
});

// Passport-Mongoose Configuration
var Account = require('./models/account').Account;
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// ***************** ROUTES ***************** //
// ** GETS ** //
app.get('/', user_routes.index);
app.get('/register', user_routes.register_page);
app.get('/login', user_routes.login_page);
app.get('/user_index', user_routes.user_index);
app.get('/user_cal/:cal_id', user_routes.user_cal);
app.get('/logout', user_routes.logout);
app.get('/orders/:_id', user_routes.show_orders);
app.get('/oauth2callback', user_routes.user_auth);

// ** POSTS ** //
app.post('/login',
  passport.authenticate('local'),
    function(req, res) {
      console.log("executing post");
      res.redirect('/user_index');
    }
);

app.post('/register', user_routes.create_acct);
app.post('/addCal', user_routes.addCal);
app.post('/sync', user_routes.sync);
app.post('/sync_fail', function (req, res) {
  console.log('Failed / broken webhook');
  console.log('Failed hook response', req.body);
});
// ***************** END ROUTES ***************** //


// App Server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));

  // Running child process (using spawn method instead of exec) to create an ultrahook instance for the context.io webhook callback
  // var hook = spawn('ultrahook', ['gyst', 3000]); // ultrahook process
  var hook = spawn('lt', ['--port', 3000, '--subdomain', 'gyst']); // directly translates to terminal command

  // NOTE: Data only comes back from this prior to error (investigate)
  hook.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  // Error handler
  hook.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  // Exit handler
  hook.on('exit', function (code) {
    console.log('child process exited with code ' + code);
  });
});