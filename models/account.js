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


var Account = new Schema({
  first_name: String,
  last_name: String,
  messages: {
    id: String,
    date: Date,
  }
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);