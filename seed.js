// Seed Database with Email Messages
var async = require('async');
var contextIO = require('contextio');
var models = require ('./models/account');
var Shipment = models.Shipment;
var Account = models.Account;
var linkParser = require('./controllers/link_parsing.js');

var ctxioClient = new contextIO.Client({
  key: "",
  secret: ""
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
    var shipment_obj_arr= [];
    // console.log(messages+Object.keys(messages).length);
    for (var i=0; i<messages.length; i++) {
      // console.log("Message no: "+i);
      var username = messages[i].addresses.from.email;
      var message_id = messages[i].message_id;
      var body_text = messages[i].body[0].content;
      var body_html = messages[i].body[1].content;

      var parsedResult =  linkParser.getShipments(username,message_id,body_html, body_text);
      // console.log(parsedResult);

      if (typeof(parsedResult) !== 'undefined') {
        shipment_obj_arr.push(parsedResult);
      }
    }
    callback(null, shipment_obj_arr);
    // try to make shipments / user as next step in waterfall for future version
  }
], function (err, results) {
  for (i=0; i<results.length; i++) {
    Shipment.create({
      tracking_number: results[i].tracking_no,
      orderID: results[i].orderID,
      delivery_date: results[i].latestArrivalDate,
      product_list: results[i].products,
      user: results[i].username
    })
  }
});