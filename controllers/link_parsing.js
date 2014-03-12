// Link Parsing
var cheerio = require('cheerio');
var url = require('url');

// ***************** HTML PARSING *****************

exports.getAllLinks = function(html) {
  var $ = cheerio.load(html);
  var order_obj = {};
  var link_text = $('a').textDelim("||").split("||");
  var link_text_clean = [];
  for (var i=0; i<link_text.length; i++) {
    if (!link_text[i].match(/\S/g)) {
      continue;
    } else {
      link_text_clean.push(link_text[i].trim());
    }
  }
  return link_text_clean;
}

  // while
  // console.log(order_obj.products)
  // return order_obj;

// Update user messages
// Model.findByIdAndUpdate(id, { name: 'jason borne' }, options, callback)

// Amazon page link product title;
// <div class="a-section a-spacing-none">
//     <h1 id="title" class="a-size-large a-spacing-none">
//       <span id="productTitle" class="a-size-large">Garcinia Cambogia Extract - 1600 mg Servings (only 2 capsules/day)- Pure 100 % Natural GMO Free Effective Appetite Suppressant and Weight Loss Supplement from Omega Soul</span>

//     </h1>
// </div>


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

// ***************** TEXT PARSING *****************

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
  var orderID = shipping_query.query.orderID
  var shipMethod = shipping_query.query.orderID
  var latestArrivalDate = new Date(shipping_query.query.latestArrivalDate * 1000);
  console.log(latestArrivalDate);
}


var test = "http://www.amazon.com/gp/r.html?R=21F78Y30XZQDM&C=3TG14KBDH777U&H=KMCZPGTTAVA8CGKAEZ0JJXOOLMEA&T=C&U=https%3A%2F%2Fwww.amazon.com%2Fgp%2Fcss%2Fshiptrack%2Fview.html%2Fref%3Dpe_385040_30332190_TE_M3T1_ST1_typ%3Fie%3DUTF8%26addressID%3Djprjpxjukjp%26trackingNumber%3D1ZRX27110206215927%26latestArrivalDate%3D1393646400%26shipMethod%3DUPS_2ND%26orderID%3D114-9179420-3435426%26shipmentDate%3D1393485113%26orderingShipmentId%3D1423686941100%26packageId%3D1"
