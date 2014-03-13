// Swig Filters
module.exports = function (swig) {
  var dequoter = function (string) {
    return string.replace(/"/g,'');
  }

  swig.setFilter('dequoter', dequoter);

  var date_render = function (str) {
    return str.match(/Date:\s(.+?)\s(AM|PM)/g)[0];
  }

  swig.setFilter('dater', date_render);
}