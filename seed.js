// Seed Database with Email Messages
var async = require('async');
var contextIO = require('contextio');
var models = require ('./models/account');
var Shipment = models.Shipment;
var Account = models.Account;
var linkParser = require('./controllers/link_parsing.js');

var ctxioClient = new contextIO.Client({
  key: "2zor5ddk",
  secret: "peQ7UrRAX4yDwElR"
});

var gyst_access_id = "5318d4b97dfe6819228a73a8";
var ships_per_user = {};

async.waterfall([
  function(callback) {
    ctxioClient.accounts(gyst_access_id).messages().get({"include_body": 1}, function (err, ctx_res) {
        if (err) throw err;
        var messages = ctx_res.body;
        callback(null, messages);
    });
  },
  function(messages, callback) {
    var shipment_obj;
    var shipment_obj_arr= [];
    // console.log(messages+Object.keys(messages).length);
    for (var i=0; i<messages.length; i++) {
      // console.log("Message no: "+i);
      var username = messages[i].addresses.from.email;
      var message_id = messages[i].message_id;
      var body_text = messages[i].body[0].content;
      var body_html = messages[i].body[1].content;

      var parseResult =  linkParser.getShipments(username,message_id,body_html, body_text);
      // console.log(parseResult);

      if (typeof(parseResult) !== 'undefined') {
        shipment_obj_arr.push(parseResult);
      }
    }
    callback(null, shipment_obj_arr);
  },
  function(shipment_obj_arr, callback) {
    console.log(shipment_obj_arr);
    // for (var tracking_no in shipment_obj) {

    // }
    // console.log(ships_per_user);
    // Will validate ships_per_user HERE
    // console.log(ships_per_user);
    // ships_per_user["dsing.1988"] = test_user;
    callback(null, ships_per_user);
  }
], function (err, results) {
  // Will save to DB HERE
  // console.log(Object.keys(result));
});