/*
 * GET home page.
 */

exports.index = function (req,res) {
  if (req.user) {
    res.render('user_index', {'user': req.user})
  }
  res.render('index');
};

