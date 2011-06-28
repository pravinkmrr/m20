
/**
 * Module dependencies.
 */

var express = require('express');
var models = require('./models');
var Account = models.Account;
var Application = models.Application;
var Keyword = models.Keyword;
var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/accounts', function(req, res){
  Account.find({}, function(err, accounts) {
    res.header('Content-Type', 'application/json');
    res.send(accounts);
  });
});

app.post('/accounts', function(req, res){
  account = new Account(req.body);
  account.save(function(err) {
    res.header('Content-Type', 'application/json');
    res.send(account);
  });
});

app.del('/accounts/:id', function(req, res){
  Account.findOne({_id: req.params.id}, function(err, account){
    if (account) {
      account.remove(function(err){
        if (err) {
          console.log(err);
        } else {
          res.send('DELETED');
        }
      });
    } else {
      res.send('Not found', 404);
    }
  });
});

app.get('/apps', function(req, res){
  var find_criteria = {};
  if (req.query.account) {
    find_criteria.account = req.query.account;
  }
  Application.find(find_criteria, function(err, applications) {
    res.header('Content-Type', 'application/json');
    res.send(applications);
  });
});

app.post('/apps', function(req, res) {
  application = new Application(req.body);
  application.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.header('Content-Type', 'application/json');
      res.send(application);
    }
  });
});

app.del('/apps/:id', function(req, res){
  Application.findOne({_id: req.params.id}, function(err, application){
    if (application) {
      application.remove(function(err){
        if (err) {
          console.log(err);
        } else {
          res.send('DELETED');
        }
      });
    } else {
      res.send('Not found', 404);
    }
  });
});

app.get('/apps/:app/keywords', function(req, res){
  Keyword.find({app: req.params.app}, function(err, keywords) {
    res.header('Content-Type', 'application/json');
    res.send(keywords);
  });
});

app.post('/apps/:app/keywords', function(req, res){
  keyword = new Keyword(req.body.keyword);
  keyword.application = req.params.app;
  keyword.save(function(err) {
    res.header('Content-Type', 'application/json');
    res.send(keyword);
  });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
