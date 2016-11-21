var express = require('express');
var Application = require('../model/application').model;
var applicationRouter = express.Router(); // koristimo express Router
var User = require('../model/user');


// definisanje ruta za blog
applicationRouter
  .get('/:id', function(req, res, next) {
    Application.findOne({
      "_id": req.params.id
    })
  })
  .get('/', function(req, res) {
    Application.find({}, function(err, data, next) {
      res.json(data);
    });
  })
  .post('/', function(req, res, next) {
    var application = new Application(req.body);
    application.save(function(err, entry) {
      if (err) return next(err);

      res.json(entry);

    });
  })
  .post('/user/:id',function(req, res, next) {
    var application = new Application(req.body);
    User.findOne({"_id":req.params.id},function (err, entry) {
      if(err) return next(err);
      application.save(function (err, application) {
        if(err) return next(err);
        User.findByIdAndUpdate(entry._id, {$push:{"applications":application}}, function (err, entry) {
          if(err) return next(err);
          //res.json(entry);
          User.findOne({"_id":req.params.id},function (err, entry) {
              res.json(entry);
          })
        });
      });
    });
  });

  module.exports = applicationRouter;