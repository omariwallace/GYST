// User model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect('mongodb://localhost/gyst');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log('Connected to DB');
});

var Account,
    Shipment;

var ObjectID = Schema.Types.ObjectId;

var shipmentSchema = new Schema({
  tracking_number: String,
  order_no: String,
  delivery_date: String,
  product_list: Array,
  message: String,
  account: ObjectID
});

var accountSchema = new Schema({
  first_name: String,
  last_name: String,
  shipments: [{ ref: shipmentSchema, type: ObjectID }]
});

accountSchema.plugin(passportLocalMongoose);

Shipment = mongoose.model('Shipment', shipmentSchema);
Account = mongoose.model('Account', accountSchema);

module.exports = {'Shipment': Shipment, 'Account': Account};


// module.exports = mongoose.model('Account', Account);