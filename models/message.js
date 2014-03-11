var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect('mongodb://localhost/gyst');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var Messages;
var Schema = mongoose.Schema;

var messageSchema = new Schema({
  user: String;
  ctx_id: String, // from Context.io, for getting the message body
  body_text: String,
  body_html: String,
  shipping_confirm_order_no: String,
  delivery_date: String,
  tracking_number: String,
  product_list: Array,
});

User = mongoose.model('User', userSchema);

Message = mongoose.model('Message', messageSchema);

module.exports = {'User': User, 'Message': Message};