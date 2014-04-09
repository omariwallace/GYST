
/**
 * Module dependencies.
 */

var express = require('express');
var user_routes = require('./routes/user');
var http = require('http');
var path = require('path');
// swig documentation ==> http://paularmstrong.github.io/swig/docs/#express
var swig = require('swig'); // required by ME
require('./controllers/filters.js')(swig); // passing in swig object through the filters via node module

// var flash = require('connect-flash');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var gapi = require('./lib/gapi');
var cp = require('child_process');
var spawn = cp.spawn

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

// persistent login sessions (recommended).
app.use(express.cookieParser("test_secret")); // necessary for express.session to work
app.use(express.session());

app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
// if ('development' == app.get('env')) {
//   app.use(express.errorHandler());
// }

app.configure('development', function(){
  console.log(" This is DEVELOPMENT!!");
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  console.log('THIS is PRODUCTION!');
  app.use(express.errorHandler());
});

// configure Passport-Mongoose
var Account = require('./models/account').Account;
// console.log(Account.serializeUser());
passport.use(new LocalStrategy(Account.authenticate()));

passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// ** ROUTES ** //
app.get('/', user_routes.index);
app.get('/register', user_routes.register_page);
app.get('/login', user_routes.login_page);
app.get('/user_index', user_routes.user_index);
app.get('/user_cal/:cal_id', user_routes.user_cal);
app.get('/logout', user_routes.logout);
app.get('/orders/:_id', user_routes.show_orders);
// app.get('/glogin', gapi.glogin);
app.get('/oauth2callback', user_routes.user_auth);

// ***************** POSTS *****************
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

// **********************************************

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));

  // Running child process (using spawn method instead of exec) to create an ultrahook instance for the context.io webhook callback
  var hook = spawn('ultrahook', ['gyst', 3000]);

  // NOTE: No data comes back from this but the callback works, why!?!?
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



// ***** PASSPORT GOOGLE OAUTH *****
// ***** Passport Oauth Works -- Cannot Figure out how to access oauth client *****
// // configure Passport-Google
// passport.use(new GoogleStrategy({
//     clientID:'717427766570-fdmuac41856age7mmeu5legtudb42lip.apps.googleusercontent.com',
//     clientSecret: 'k395f6ICzs5FEl_y0jzsTeHA',
//     callbackURL: "http://localhost:3000/oauth2callback"
//   },
//   function(accessToken, refreshToken, profile, done) {
//     // asynchronous verification, for effect...
//     process.nextTick(function () {
//       console.log("accessToken: ", accessToken);
//       console.log("refreshToken: ", refreshToken);
//       console.log("profile: ", profile);

//       // To keep the example simple, the user's Google profile is returned to
//       // represent the logged-in user.  In a typical application, you would want
//       // to associate the Google account with a user record in your database,
//       // and return that user instead.
//       return done(null, profile);
//     });
//   }
// ));
// ***** ABOVE THIS LINE WORKS -- JUST UNCOMMENT FOR Passport Google Oauth *****

// GET /auth/google/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
// app.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/user_index' })
// );
// ******************************************
// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) { return next(); }
//   res.redirect('/login');
// }