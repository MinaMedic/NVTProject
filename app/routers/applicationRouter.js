var express = require('express');
var Application = require('../model/application').model;
var applicationRouter = express.Router(); // koristimo express Router
var User = require('../model/user').model;


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
  //vrati sve aplikacije korisnika
  .get('/user/:id', function(req, res, next) {
    User.findOne({
      "_id": req.params.id
    }).populate('applications').exec(function(err, entry) {  //ovo reci jovani!!!!!!!
      // ako se desila greska predjemo na sledeci middleware (za rukovanje greskama)
      if (err) return next(err);
      res.json(entry.applications);
    });
  })
  //OVO JE REGISTRACIJA APLIKACIJE
  //kada korisniku dodamo aplikaciju, ona se dodaje u listu nejgovih aplikacija
  //i u aplikaciji se setuje owner na tog usera
  .post('/user/:id',function(req, res, next) {
    var application = new Application(req.body);
    User.findOne({"_id":req.params.id},function (err, entry) {
      if(err) return next(err); //greska ako nije pronasao usera

       // application.owner = entry;
        application.save(function (err, application) {
          if(err) return next(err); //ako nije upisao aplikaciju

          User.findByIdAndUpdate(entry._id, {$push:{"applications":application}}, function (err, entry) {
            if(err) return next(err); //ako nije uspeo korisniku da doda aplikaciju
        
            Application.findByIdAndUpdate(application._id, {$set:{owner:entry}}, function (err, entry) {
              Application.findOne({"_id":application.id},function (err, entry) {
                res.json(entry); //vrati apdejtovan objekat
             })
            })
          });
        });
      });
  });

  module.exports = applicationRouter;