// Link Parsing
var cheerio = require('cheerio');
var url = require('url');

// ***************** HTML PARSING *****************

exports.getAllLinks = function(html) {
  var $ = cheerio.load(html);
  var links_obj = {};
  var link_text = $('a').textDelim('||').split('||');
  var links = $('a')

  // Get all links in an object {key_no: href}
  for (key in links) {
    if (links.hasOwnProperty(key)) {
      if (links[key]['attribs'] !== undefined)
      links_obj[key] = links[key]['attribs']['href']
    }
  }

  // Get specfic tracking link
  for (link in links_obj) {
    if((/trackingNumber/g).test(links_obj[link]))
      var trackingLink = links_obj[link]
  }

  // Extract Tracking Info from link
  var tracking_obj = getTrackingInfo(trackingLink);

  // Clean link text for product names
  var link_text_clean = [];
  for (var i=0; i<link_text.length; i++) {
    if (!link_text[i].match(/\S/g)) {
      continue;
    } else {
      link_text_clean.push(link_text[i].trim());
    }
  }

  // Get products array
  for (i=0; i<link_text_clean.length; i++) {
      if(link_text_clean[i].match(/\Your Orders/g) !== null) {
          var begin = i+1;
      }
      if(link_text_clean[i].match(/Online Return Center/) !== null) {
          var end1 = i;
      }
      if(link_text_clean[i].match(/\d{3}-\d/) !== null) {
          var end2 = i;
      }
  }
  if (end2 < begin) {
      var end = end1;
  } else if (end2 < end1) {
      var end = end2;
  }
  var products = link_text_clean.slice(begin, end);

  tracking_obj['products'] = products;

  return tracking_obj;
}

// ** Helper Function ** //
function getTrackingInfo (url_string) {
  url_string = url_string.replace(/amp;/g,''); // to remove escaped "&" sign from query param
  var parsed_url = url.parse(url_string,true); // true makes the query parameter an object;
  var query_string_url = parsed_url.query.U;
  var shipping_query = url.parse(query_string_url,true);

  var tracking_obj = {}
  var tracking_no = shipping_query.query.trackingNumber;
  var orderID = shipping_query.query.orderID;
  var shipMethod = shipping_query.query.shipMethod;
  var latestArrivalDate = new Date(shipping_query.query.latestArrivalDate * 1000);
  tracking_obj = {
    tracking_no: tracking_no,
    orderID: orderID,
    shipMethod: shipMethod,
    latestArrivalDate: latestArrivalDate
  }
  // console.log(tracking_obj);
  // { '9361289949033129100801':
  //  { orderID: '110-9800370-4877869',
  //    shipMethod: 'USPS_SC_AT_PARCEL',
  //    latestArrivalDate: Mon Mar 10 2014 23:00:00 GMT-0400 (EDT) } }
  return tracking_obj;
}

// Update user messages
// Model.findByIdAndUpdate(id, { name: 'jason borne' }, options, callback)

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

// ************* TEXT PARSING (Regex) *************

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

// ***** NOTE :: REPLACED WITH HTML SEARCH *****
// ** Get Product List **
// var links = str.match(/(?:(Shipment Details\s<http\:)).*?(<)/g);
// var product = links[0].match(/(?:>\s).*?(?=<)/g)[0].slice(1).trim();
// console.log(product);
// return product


var test = "http://www.amazon.com/gp/r.html?R=21F78Y30XZQDM&C=3TG14KBDH777U&H=KMCZPGTTAVA8CGKAEZ0JJXOOLMEA&T=C&U=https%3A%2F%2Fwww.amazon.com%2Fgp%2Fcss%2Fshiptrack%2Fview.html%2Fref%3Dpe_385040_30332190_TE_M3T1_ST1_typ%3Fie%3DUTF8%26addressID%3Djprjpxjukjp%26trackingNumber%3D1ZRX27110206215927%26latestArrivalDate%3D1393646400%26shipMethod%3DUPS_2ND%26orderID%3D114-9179420-3435426%26shipmentDate%3D1393485113%26orderingShipmentId%3D1423686941100%26packageId%3D1";

var test2 ="http://www.amazon.com/gp/r.html?R=BNTMD3MRRVZB&amp;C=3TG14KBDH777U&amp;H=JAJRTXCCBOBHENKCE4CRTESGQEEA&amp;T=C&amp;U=https%3A%2F%2Fwww.amazon.com%2Fgp%2Fcss%2Fshiptrack%2Fview.html%2Fref%3Dpe_385040_30332190_TE_M3T1_ST1_typ%3Fie%3DUTF8%26addressID%3Djkojmvhrpn%26trackingNumber%3D9361289949060103561143%26latestArrivalDate%3D1390104000%26shipMethod%3DUSPS_SC_AT_PARCEL%26orderID%3D112-3510611-1917001%26shipmentDate%3D1389942866%26orderingShipmentId%3D1224488569908%26packageId%3D1"

// var test3 = test2.replace(/amp;/g,'')
// console.log(test3);
// // console.log(url.parse(test3, true))
// // console.log(url.parse(test))
// console.log(getTrackingNumber(test3))