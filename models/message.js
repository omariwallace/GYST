var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect('mongodb://localhost/gyst');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var Schema = mongoose.Schema;

var Message;
var Order;

var orderSchema = new Schema({
  username: String, // message.addresses.from
  order_no: String,
  delivery_date: String,
  tracking_number: String,
  product_list: Array,
  message: [messageSchema]
});

var messageSchema = new Schema({
  ctx_id: String, // messsage.message_id
  body_text: String, // body query [0]
  body_html: String, // body query [1]
});



Order = mongoose.model('Order', orderSchema);
Message = mongoose.model('Message', messageSchema);

module.exports = {'Order': Order, 'Message': Message};