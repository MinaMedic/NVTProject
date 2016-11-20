var express = require('express');
var User = require('../model/user');
var userRouter = express.Router(); // koristimo express Router

// definisanje ruta za blog
userRouter
  .get('/:id', function(req, res, next) {
    User.findOne({
      "_id": req.params.id
    }).populate('applications').exec(function(err, entry) {
      // ako se desila greska predjemo na sledeci middleware (za rukovanje greskama)
      if (err) next(err);
      res.json(entry);
    });
  })
  .get('/', function(req, res) {
    User.find({}, function(err, data, next) {
      res.json(data);
    });
  })
  .post('/', function(req, res, next) {
    var user = new User(req.body);
    user.save(function(err, entry) {
      if (err) next(err);

      res.json(entry);

    });
  });

  module.exports = userRouter;