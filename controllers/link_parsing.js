// Link Parsing
var cheerio = require('cheerio');

module.exports.getAllLinks = function(html) {
  var $ = cheerio.load(html);
  var links_obj = {};
  var link_text = $('a').textDelim("||").split("||");
  var link_text_clean = [];
  for (var i=0; i<link_text.length; i++) {
    if (!link_text[i].match(/\S/g)) {
      continue;
    } else {
      link_text_clean.push(link_text[i].trim());
    }
  }
  links_obj.products = [];
  for (var i=0; i<link_text_clean.length, i++) {

  }

  // while
  // console.log(links_obj.products)
  // return links_obj;
}

// Update user messages
// Model.findByIdAndUpdate(id, { name: 'jason borne' }, options, callback)

// Amazon page link product title;
// <div class="a-section a-spacing-none">
//     <h1 id="title" class="a-size-large a-spacing-none">
//       <span id="productTitle" class="a-size-large">Garcinia Cambogia Extract - 1600 mg Servings (only 2 capsules/day)- Pure 100 % Natural GMO Free Effective Appetite Suppressant and Weight Loss Supplement from Omega Soul</span>

//     </h1>
// </div>


