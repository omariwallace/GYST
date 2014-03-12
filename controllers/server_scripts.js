var routes = require('../routes/user.js')
var url = require('url');
var async = require('async')
var contextIO = require('contextio');


var ctxioClient = new contextIO.Client({
  key: "2zor5ddk",
  secret: "peQ7UrRAX4yDwElR"
});

var gyst_access_id = "5318d4b97dfe6819228a73a8";

// exports.

// ** Get Shipping Confirmation No. **
// str.match(/(?=Shipping Confirmation Order #).*?(?=<)/)[0].split(" #")
// ==> [ 'Shipping Confirmation Order', '112-7659907-8363465' ]

// ** Get Delivery Date **
// str.match(/(?=Your guaranteed delivery date is:).*?(?=\*\s)/)[0].split(" *")
// ==> [ 'Your guaranteed delivery date is:', 'Friday, January 17, 2014' ]

// ** Get Shipping Tracker Link **
// var links = str.match(/(?=<http).*?(?:>)/g);

// var trackingLink;

// for (var i=0; i<links.length; i++) {
//     if (links[i].indexOf("trackingNumber") !== -1) {
//         trackingLink = links[i].substring(1,links[i].length-1);
//     }
// }

// console.log(trackingLink)
// return trackingLink

// ** Get Product List **
// var links = str.match(/(?:(Shipment Details\s<http\:)).*?(<)/g);
// var product = links[0].match(/(?:>\s).*?(?=<)/g)[0].slice(1).trim();
// console.log(product);
// return product

exports.getTrackingNumber = function (url_string) {
  var parsed_url = url.parse(url_string,true);
  var query_string_url = parsed_url.query.U;

  var shipping_query = url.parse(query_string_url,true);
  // Shipping query object
  // { ie: 'UTF8',
  //   addressID: 'jprjpxjukjp',
  //   trackingNumber: '1ZRX27110206215927',
  //   latestArrivalDate: '1393646400',
  //   shipMethod: 'UPS_2ND',
  //   orderID: '114-9179420-3435426',
  //   shipmentDate: '1393485113',
  //   orderingShipmentId: '1423686941100',
  //   packageId: '1>' }
  var tracking_no = shipping_query.query.trackingNumber
  console.log(tracking_no);
}

// Function doesn't work; error with async?
exports.getMessageBody = function (message_id) {
  ctxioClient.accounts("5318d4b97dfe6819228a73a8").messages(message_id).get(function (err, ctx_res) {
    if (err) throw err;
    message = ctx_res.body
  });
}


var test = "http://www.amazon.com/gp/r.html?R=21F78Y30XZQDM&C=3TG14KBDH777U&H=KMCZPGTTAVA8CGKAEZ0JJXOOLMEA&T=C&U=https%3A%2F%2Fwww.amazon.com%2Fgp%2Fcss%2Fshiptrack%2Fview.html%2Fref%3Dpe_385040_30332190_TE_M3T1_ST1_typ%3Fie%3DUTF8%26addressID%3Djprjpxjukjp%26trackingNumber%3D1ZRX27110206215927%26latestArrivalDate%3D1393646400%26shipMethod%3DUPS_2ND%26orderID%3D114-9179420-3435426%26shipmentDate%3D1393485113%26orderingShipmentId%3D1423686941100%26packageId%3D1"
