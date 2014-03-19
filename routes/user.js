//Page dependencies
var contextIO = require('contextio');
var async = require('async');
var gapi = require('../lib/gapi');
var gcal_api = require('../controllers/gcal_api');
var Q = require ('q');
var models = require('../models/account'),
    GoogleUser = models.GoogleUser,
    Account = models.Account,
    Shipment = models.Shipment;


// Context.io //
/** General URL structure to call the API

  ctxioClient.RESOURCE(INSTANCE_ID).SUB_RESOURCE().METHOD(PARAMS, CALLBACK_FN)

  ==>Example:
  ctxioClient.accounts().get({limit:15}, function (err, response) {
    if (err) throw err;
    console.log(response.body);
  });

  ==>Produces URL: GET /2.0/accounts?limit=15
**/
var ctxioClient = new contextIO.Client({
  key: "2zor5ddk",
  secret: "peQ7UrRAX4yDwElR"
});

exports.index = function (req,res) {
  if (req.user) {
    res.redirect('/user_index');
  } else {
    res.render('index');
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

// Cal id for created calendar 6j8lf2h957jk549q43qs2q3jlc@group.calendar.google.com

exports.user_auth = function (req,res) {
  var code = req.query.code;
  // console.log(req.user)
  // var user_id = req.user.id;
  gcal_api.getUserToken(code)
    // .then(gcal_api.getCalData)
    // .then(gcal_api.addGYSTevent)
    .then(gcal_api.getUserData)
    .then(gcal_api.saveToDB)
    .then(gcal_api.retrieveShipments)
    .then(gcal_api.addGYSTCal)
    .done(function (val) {
      console.log("Cal ID from promise: ", val);
      res.redirect('/user_cal/'+val);
    });
  // res.redirect('/user_cal/'+user_id);
};

exports.user_index = function (req,res) {
  var url = gapi.url;
  res.render('user_index', {'user': req.user, 'url': url});

};


exports.user_cal = function (req,res) {
  var user = req.user
  var cal_id = req.params.cal_id
  res.render('user_cal', {'user': user, 'cal_id': cal_id})
};


// ******************** OLD ********************
// exports.user_cal = function (req,res) {
//   var url = gapi.url;
//   if (!req.params._id) {
//     res.render('user_index', {'user': req.user});
//   } else {
//     var user_id = req.params._id;
//     GoogleUser.findOne({'_id': user_id}, function (err, user) {
//       res.render('user_cal', {'user': user});
//     });
//   }
// };



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
        res.render ('user_orders', {'user': req.user})
      } else {
        res.render('user_orders', {'orders': orders_arr, 'user': req.user})
      }
    })
  })

}

// exports.show_messages = function(req, res) {
//   var user_email = req.user ? req.user.username : "";
//   async.waterfall([
//     function(callback) {
//       ctxioClient.accounts("5318d4b97dfe6819228a73a8").messages().get({'from':user_email}, function (err, ctx_res) {
//           if (err) throw err;
//           var messages = ctx_res.body;
//           var messageId_arr = [];
//           for (i=0; i<messages.length; i++) {
//             messageId_arr.push(messages[i].message_id);
//           }
//         callback(null, messages, messageId_arr);
//       });
//     },
//     function(messages, messageId_arr, callback) {
//       var message_container_text = [];
//       var message_container_html = [];
//       async.each(messageId_arr, function (item, inner_callback) {
//         ctxioClient.accounts("5318d4b97dfe6819228a73a8").messages(item).body().get(function (err, ctx_res) {
//         if (err) throw err;
//         message = ctx_res.body[0];
//         message_html = ctx_res.body[1];
//         message_container_text.push(message);
//         message_container_html.push(message_html);
//         inner_callback();
//         });
//       }, function (err) {
//         callback(null, messages, message_container_text, message_container_html);
//       });
//     },
//     function(messages, message_container_text, message_container_html, callback) {
//       res.render('user_messages', { "messages": messages, "user": req.user, "message_container_text": message_container_html});
//         console.log(messages);
//       callback();
//     }
//   ]);
// };

// Look into why these didn't work for getting the message body!!
      //** Take 2 **
      // async.each(messageId_arr, function (item, callback) {
      //     console.log(models.getMessageBody(item))
      //     message_container_text.push(models.getMessageBody(item))
      //     callback();
      //   }, function(err) {
      //   console.log("done iterating")
      //   console.log(message_container_text)
      // });
      //** Take 1 **
      // for (i=0; i<messageId_arr.length; i++) {
      //   message_container_text.push(models.getMessageBody(messageId_arr[i]))
      // };
      // console.log(message_container_text)
      // callback(null, messages, message_container_text);