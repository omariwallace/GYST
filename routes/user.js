//Page dependencies
var contextIO = require('contextio');
var async = require('async');
var Account = require('../models/account')

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

exports.register_page = function(req, res){
  res.render('register', {});
};

exports.create_acct = function(req, res){
  Account.register(new Account({'username': req.body.username, 'first_name': req.body.first_name, 'last_name': req.body.last_name}), req.body.password, function (err, user) {
      if (err) {
        console.log(err)
        return res.render('register', {'user': user})
      }
      // NOTE!! Investigate why res.redirect doesn't work here (in order to pass req.user along)
      res.render('user_index', {'user': user});
  })
};

exports.login_page = function(req, res){
  if (req.user) {
    res.redirect('user_index')
  }
  res.render('login', {'user': req.user});
};

exports.logout = function(req, res){
  req.logout();
  res.redirect('/');
};

exports.user_index = function (req,res) {
  res.render('user_index', {'user': req.user})
}

exports.show_messages = function(req, res) {
  var user_email = req.user ? req.user.username : "";
  async.waterfall([
    function(callback) {
      ctxioClient.accounts("5318d4b97dfe6819228a73a8").messages().get({'from':user_email}, function (err, ctx_res) {
          if (err) throw err;
          var messages = ctx_res.body
          var messageId_arr = [];
          for (i=0; i<messages.length; i++) {
            messageId_arr.push(messages[i].message_id)
          }
        callback(null, messages, messageId_arr);
      });
    },
    function(messages, messageId_arr, callback) {
      var message_container_text = [];
      var message_container_html = [];
      async.each(messageId_arr, function (item, inner_callback) {
        ctxioClient.accounts("5318d4b97dfe6819228a73a8").messages(item).body().get(function (err, ctx_res) {
        if (err) throw err;
        message = ctx_res.body[0];
        message_html = ctx_res.body[1];
        message_container_text.push(message);
        message_container_html.push(message_html);
        inner_callback();
        })
      }, function (err) {
        callback(null, messages, message_container_text, message_container_html);
      })
    },
    function(messages, message_container_text, message_container_html, callback) {
      res.render('user_messages', { "messages": messages, "user": req.user, "message_container_text": message_container_html});
        console.log(messages)
      callback();
    }
  ])
}


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