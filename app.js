
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
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
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// configure Passport-Mongoose
var Account = require('./models/account').Account;
// console.log(Account.serializeUser());
passport.use(new LocalStrategy(Account.authenticate()));

passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


// ** ROUTES ** //
app.get('/', routes.index);
app.get('/register', user_routes.register_page);
app.get('/login', user_routes.login_page);
app.get('/user_index', user_routes.user_index)
app.get('/logout', user_routes.logout);
app.get('/messages/:_id', user_routes.show_messages)

app.post('/login',
  passport.authenticate('local'),
    function(req, res) {
      console.log("executing post")
      res.redirect('/user_index');
    }
);
app.post('/register', user_routes.create_acct);

app.post('/test', function (req, res) {
  console.log('Success: Transmission received from context.io')
})

app.post('/fail', function (req, res) {
  console.log('Failure: Transmission received from context.io')
})


var test_date = new Date(1394561071 *1000);
var test_date2 = new Date(1394135227 *1000);
console.log("This is from test date 1: "+test_date);
console.log("This is from test date 2: "+test_date2);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// ***** Old Local Passport ISH *****
// // Use the LocalStrategy within Passport.
// // Passport session setup.
// //   To support persistent login sessions, Passport needs to be able to
// //   serialize users into and deserialize users out of the session.  Typically,
// //   this will be as simple as storing the user ID when serializing, and finding
// //   the user by ID when deserializing.
// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
//   findById(id, function (err, user) {
//     done(err, user);
//   });
// });

// //   Strategies in passport require a `verify` function, which accept
// //   credentials (in this case, a email and password), and invoke a callback
// //   with a user object.  In the real world, this would query a database;
// //   however, in this example we are using a baked-in set of users.
// passport.use(new LocalStrategy(
//   // "done" is a callback function that you CANNOT see
//   function(username, password, done) {
//     // asynchronous verification, for effect...
//     process.nextTick(function () {

//       // Find the user by username.  If there is no user with the given
//       // username, or the password is not correct, set the user to `false` to
//       // indicate failure and set a flash message.  Otherwise, return the
//       // authenticated `user`.
//       findByUsername (username, function(err, user) {
//         if (err) { return done(err); }
//         if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
//         if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
//         return done(null, user);
//       })
//     });
//   }
// ));

// var users = [
//     { id: 1, username: 'bob@example.com', password: 'secret', name: 'bob' }
//   , { id: 2, username: 'joe@example.com', password: 'birthday', name: 'hoe' }
//   , { id: 3, username: 'omari.wallace@gmail.com', password: 'admin', name: 'Omari' }
//   , { id: 4, username: 'nnicholas1984@gmail.com', password: 'admin', name: 'Omari' }

// ];

// function findById(id, fn) {
//   var idx = id - 1;
//   if (users[idx]) {
//     fn(null, users[idx]);
//   } else {
//     fn(new Error('User ' + id + ' does not exist'));
//   }
// }


// function findByUsername(username, fn) {
//   for (var i = 0, len = users.length; i < len; i++) {
//     var user = users[i];
//     if (user.username === username) {
//       return fn(null, user);
//     }
//   }
//   return fn(null, null);
// }



/**** Notes to SELF ****
==> path is an object with the following properties
{ resolve: [Function],
  normalize: [Function],
  join: [Function], // brings parameters together with a '/' in between
  relative: [Function],
  sep: '/',
  delimiter: ':',
  dirname: [Function], // given a string with '/' delimeters, returns everything up until the last '/'
  basename: [Function],
  extname: [Function],
  exists: [Function: deprecated],
  existsSync: [Function: deprecated],
  _makeLong: [Function] }

==>__dirname is the route to the folder containing THIS app
/Users/omarilwallace/fullstack/capstone/webaudio

****/
