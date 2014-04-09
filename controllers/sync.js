// Populate Database with NEW Email Messages for a specific user
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

ctxioClient.accounts(gyst_access_id).messages().get({"include_body": 1, "from": "omari.wallace@gmail.com"}, function (err, ctx_res) {
      if (err) throw err;
      var messages = ctx_res.body;
});