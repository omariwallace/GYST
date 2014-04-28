// Page dependencies
var contextIO = require('contextio');
var async = require('async');
var gapi = require('../lib/gapi');
var gcal_api = require('../controllers/gcal_api');
var Q = require ('q');
var linkParser = require('../controllers/link_parsing.js');
var models = require('../models/account'),
    GoogleUser = models.GoogleUser,
    Account = models.Account,
    Shipment = models.Shipment;


// Context.io (See Note Below) //
var ctxioClient = new contextIO.Client({
  key: "2zor5ddk",
  secret: "peQ7UrRAX4yDwElR"
});

var gyst_access_id = "5318d4b97dfe6819228a73a8";

exports.index = function (req,res) {
  // Run a sync every time a user visits the home page
  ctxioClient.accounts(gyst_access_id).sync().post(function (err, response) {
    if (err) throw err;
  });

  if (req.user) {
    res.redirect('/user_index'); // Render user page if a user is logged in and attached to the request object
  } else {
    res.render('index'); // Otherwise render landing page
  }
};

exports.register_page = function(req, res){
  res.render('register', {});
};

exports.create_acct = function(req, res){
  var url = gapi.url;
  Account.register(new Account({'username': req.body.username, 'first_name': req.body.first_name, 'last_name': req.body.last_name}), req.body.password, function (err, user) {
      if (err) {
        console.log(err);
        return res.render('register', {'user': user});
      }
      // NOTE!! Investigate why res.redirect doesn't work here (in order to pass req.user along)
      res.render('user_index', {'user': user, 'url': url});
  });
};

exports.login_page = function(req, res){
  if (req.user) {
    res.redirect('/user_index');
  }
  res.render('login', {'user': req.user});
};

exports.logout = function(req, res){
  req.logout();
  res.redirect('/');
};

exports.user_auth = function (req,res) {
  var code = req.query.code;
  gcal_api.getUserToken(code)
    .then(gcal_api.getUserData)
    .then(gcal_api.saveToDB)
    .then(gcal_api.retrieveShipments)
    .then(gcal_api.addGYSTCal)
    .done(function (val) {
      console.log("Cal ID from promise: ", val);
      res.redirect('/user_cal/'+val);
    });
};

exports.user_index = function (req,res) {
  var url = gapi.url;
  res.render('user_index', {'user': req.user, 'url': url});

};


exports.user_cal = function (req,res) {
  var user = req.user;
  var cal_id = req.params.cal_id;
  res.render('user_cal', {'user': user, 'cal_id': cal_id});
};


exports.addCal = function (req, res) {
  var user_id = req.params._id;
  gcal_api.findUserToken(user_id)
    .then(gcal_api.addGYSTCal);
};

exports.show_orders = function (req, res) {
  var user_id = req.params._id;
  Account.findById(user_id, 'username', function (err, user) {
    Shipment.find({ 'user': user.username}, function (err, orders_arr) {
      if (orders_arr.length === 0) {
        res.render ('user_orders', {'user': req.user});
      } else {
        res.render('user_orders', {'orders': orders_arr, 'user': req.user});
      }
    });
  });

};

exports.sync = function (req, res) {
  var webhook = req.body;
  console.log("Webhook Success!");
  console.log("Webhook response: ", webhook);

  var email = webhook.message_data;
  var subject = email.subject;
  var sender = email.addresses.from.email;
  var email_id = email.email_message_id;
  var body_text = email.body[0].content;
  var body_html = email.body[1].content;

  // Verify email
  var check = new RegExp ("Your Amazon.com order.+has shipped","g");
  if(check.test(subject)) {
    console.log("Email verified");

    // Parse email into shipment object;
    var parsedEmail =  linkParser.getShipments(sender,email_id,body_html, body_text);

    console.log("Parsed email: ", parsedEmail);

    // Save to DB
    Shipment.create({
      tracking_number: parsedEmail.tracking_no,
      orderID: parsedEmail.orderID,
      delivery_date: parsedEmail.latestArrivalDate,
      product_list: parsedEmail.products,
      user: parsedEmail.username
    });

  } else {
    console.log("Email rejected");
    // NOTE: Add Nodemailer for response to user that email was rejected
    // Delete from we.gyst inbox
    ctxioClient.accounts(gyst_access_id).messages(email_id).delete();
  }

};

/**
==> NOTES
****** General URL structure to call the API ******

  URL Structure:
  ==> ctxioClient.RESOURCE(INSTANCE_ID).SUB_RESOURCE().METHOD(PARAMS, CALLBACK_FN)

  ==>Example:
  ctxioClient.accounts().get({limit:15}, function (err, response) {
    if (err) throw err;
    console.log(response.body);
  });

  ==>Produces URL: GET /2.0/accounts?limit=15
**/