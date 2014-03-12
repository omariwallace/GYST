// Swig Filters
module.exports = function (swig) {
  var dequoter = function (string) {
    return string.replace(/"/g,'');
  }

  swig.setFilter('dequoter', dequoter);
}