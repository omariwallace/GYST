// Seed Database with Email Messages
var async = require('async');
var contextIO = require('contextio');
var models = require ('./models/message');
var linkParser = require('./controllers/link_parsing.js')
var Message = models.Message;

var ctxioClient = new contextIO.Client({
  key: "2zor5ddk",
  secret: "peQ7UrRAX4yDwElR"
});

var gyst_access_id = "5318d4b97dfe6819228a73a8";
var message_obj = {};

async.waterfall([
  function(callback) {
    ctxioClient.accounts(gyst_access_id).messages().get(function (err, ctx_res) {
        if (err) throw err;
        var messages = ctx_res.body
        var messageId_arr = [];
        for (i=0; i<messages.length; i++) {
          var user = messages[i].addresses.from.email
          var ctx_id = messages[i].message_id
          // console.log(ctx_id);
          messageId_arr.push(ctx_id);
          message_obj[ctx_id] = {}
          message_obj[ctx_id]["user"] = user;
          // message_obj[ctx_id]["ctx_id"] = ctx_id;
        }
      callback(null, messageId_arr, message_obj);
    });
  },
  function(messageId_arr, message_obj, callback) {
    var message_container_text = [];
    var message_container_html = [];
    async.each(messageId_arr, function (ctx_id, inner_callback) {
      ctxioClient.accounts("5318d4b97dfe6819228a73a8").messages(ctx_id).body().get(function (err, ctx_res) {
      if (err) throw err;
      message_text = ctx_res.body[0].content;
      message_html = ctx_res.body[1].content;
      message_obj[ctx_id]["body_text"] = message_text
      message_obj[ctx_id]["body_html"] = message_html
      message_container_text.push(message_text);
      message_container_html.push(message_html);
      inner_callback();
      })
    }, function (err) {
      callback(null, message_obj);
    })
  },
  function(message_obj, callback) {
    // Nicoles shoes = 531dd5fc664f4b92528b456b
    // Sierra order = 531df31223c300261c8b4569
    var test_html = "Single message_obj body: "+message_obj["531dd5fc664f4b92528b456b"]["body_html"];

    // Message object: ALL KEYS (Message ID's)
    console.log("Message obj keys: "+Object.keys(message_obj))

    // Message object: ONE MESSAGE KEYS (user, body, etc.)
    // console.log("Single message_obj keys: "+Object.keys(message_obj["531932de0a553da2728b456c"]));

    // Message object: Single Message body
    // console.log("Single message_obj body: "+message_obj["531a194937e1f156228b456a"]["body_html"]);

    message_obj.test_html = test_html;
    // BE SURE TO SET THIS BACK TO THE FULL MESSAGE OBJECT!!
    // AND SAVE TO THE DATAB
    callback(null, message_obj.test_html);
  }
], function (err, result) {
  var test = linkParser.getAllLinks(result);
  // console.log(test);
})