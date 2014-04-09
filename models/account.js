// User model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var findOrCreate = require('mongoose-findorcreate');

mongoose.connect('mongodb://localhost/gyst');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  // console.log('Connected to DB');
});

var Account,
    GoogleUser,
    Shipment;

var ObjectID = Schema.Types.ObjectId;

var accountSchema = new Schema({
  first_name: String,
  last_name: String,
  google_user: [googleUserSchema],
  shipments: [{ ref: shipmentSchema, type: ObjectID }]
});

var googleUserSchema = new Schema({
  googID: String,
  email: String,
  first_name: String,
  last_name: String,
  tokens: Object,
  shipments: [{ ref: shipmentSchema, type: ObjectID }]
});
googleUserSchema.plugin(findOrCreate);

// User returned from Google Authentication
// { id: '113687717830550161318',
//   email: 'omari.wallace@gmail.com',
//   verified_email: true,
//   name: 'Omari Wallace',
//   given_name: 'Omari',
//   family_name: 'Wallace',
//   link: 'https://plus.google.com/113687717830550161318',
//   picture: 'https://lh3.googleusercontent.com/-3slmkYzK1eo/AAAAAAAAAAI/AAAAAAAAAOQ/BhsnzXwSLMc/photo.jpg',
//   gender: 'male',
// }

var shipmentSchema = new Schema({
  tracking_number: String,
  orderID: String,
  delivery_date: String,
  product_list: Array,
  user: String
});

accountSchema.plugin(passportLocalMongoose);

Shipment = mongoose.model('Shipment', shipmentSchema);
Account = mongoose.model('Account', accountSchema);
GoogleUser = mongoose.model('GoogleUser', googleUserSchema);

module.exports = {'Shipment': Shipment, 'Account': Account, 'GoogleUser': GoogleUser};


// module.exports = mongoose.model('Account', Account);