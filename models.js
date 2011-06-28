var mongoose = require('mongoose');
var uuid = require('node-uuid');

mongoose.connect('mongodb://localhost/metromovil');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

function generateApiKey() {
  return uuid().replace(/[^a-zA-Z 0-9]+/g, '');
}

var Account = new Schema({
  username: {type: String, unique: true},
  api_key: {type: String, default: generateApiKey, unique: true}
});

var Application = new Schema({
  account: String,
  name: String,
  url: String,
  shortcode: String
});

Application.path('account').validate(function (v, fn) {
  Account.findOne({username: v}, function(err, account) {
    if (account) {
      fn(true);
    } else {
      fn(false);
    }
  });
}, 'Account not found'); 

var Keyword = new Schema({
  text: {type: String},
  shortcode: {type: String},
  application: ObjectId
});

Keyword.index({text: 1, shortcode: 1});

mongoose.model('Account', Account);
var Account = exports.Account = mongoose.model('Account');

mongoose.model('Application', Application);
var Application = exports.Application = mongoose.model('Application');

mongoose.model('Keyword', Keyword);
var Keyword = exports.Keyword = mongoose.model('Keyword');
