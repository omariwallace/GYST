var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect('mongodb://localhost/gyst');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var Messages;
var Schema = mongoose.Schema;

var messageSchema = new Schema({
  ctx_id: String, // messsage.message_id
  user: String, // message.addresses.from
  body_text: String, // body query [0]
  body_html: String, // body query [1]
  shipping_confirm_order_no: String,
  delivery_date: String,
  tracking_number: String,
  product_list: Array,
});


Message = mongoose.model('Message', messageSchema);
module.exports = {'Message': Message};