var express = require('express');
var Application = require('../model/application');
var applicationRouter = express.Router(); // koristimo express Router

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
      if (err) next(err);

      res.json(entry);

    });
  });

  module.exports = applicationRouter;