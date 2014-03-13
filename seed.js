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
var order_obj = {};

async.waterfall([
  function(callback) {
    ctxioClient.accounts(gyst_access_id).messages().get({"include_body": 1}, function (err, ctx_res) {
        if (err) throw err;
        var messages = ctx_res.body;
        // var messageId_arr = [];
        for (i=0; i<messages.length; i++) {
          var ctx_id = messages[i].message_id;
          var username = messages[i].addresses.from.email;
          var body_text = messages[i].body[0].content;
          var body_html = messages[i].body[1].content;
          message_obj[ctx_id] = {}
          message_obj[ctx_id]["username"] = username
          message_obj[ctx_id]["body_text"] = body_text
          message_obj[ctx_id]["body_html"] = body_html
        }
        callback(null, message_obj);
    });
  },
  function(message_obj, callback) {
    // Nicoles shoes = 531dd5fc664f4b92528b456b
    // Sierra order = 531df31223c300261c8b4569
    // Darron order = 531d4383f37c1f012d8b4567
    var test_html = message_obj["531df31223c300261c8b4569"]["body_html"];
    for (message in message_obj) {

    }

    // Message object: ALL KEYS (Message ID's)
    // console.log("Message obj keys: "+Object.keys(message_obj))

    // Message object: ONE MESSAGE KEYS (username, body, etc.)
    // console.log("Single message_obj keys: "+Object.keys(message_obj["531932de0a553da2728b456c"]));

    // Message object: Single Message body
    // console.log("Single message_obj body: "+message_obj["531a194937e1f156228b456a"]["body_html"]);

    message_obj.test_html = test_html; // <== BE SURE TO SET THIS BACK TO THE FULL MESSAGE OBJECT!!
    // AND SAVE TO THE DATAB
    callback(null, message_obj);
  }
], function (err, result) {
  // console.log(Object.keys(result));
  var test = linkParser.getAllLinks(result.test_html);
  console.log(test);
})