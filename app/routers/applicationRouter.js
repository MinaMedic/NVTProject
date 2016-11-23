var express = require('express');
var applicationRouter = express.Router(); // koristimo express Router


//Importovanje postojecih dokumenata
var Application = require('../model/application').model;
var User = require('../model/user').model;


//Definisanje ruta za aplikaciju
applicationRouter
  //Metoda koja vraca aplikaciju na osnovu prosledjenog ID-a
  //URL: api/applications/id
  .get('/:id', function(req, res, next) {
    Application.findOne({
      "_id": req.params.id
    })
  })


  //Metoda koja vraca sve aplikacije
  //URL: api/applications
  .get('/', function(req, res) {
    Application.find({}, function(err, data, next) {
      res.json(data);
    });
  })


  //Metoda koja vraca sve aplikacije jednog korisnika
  //Unutar req.param je prosledjen ID korisnika
  //URL: api/applications/user/IDuser
  .get('/user/:id', function(req, res, next) {
    User.findOne({
      "_id": req.params.id
    }).populate('applications').exec(function(err, entry) {
      if (err) return next(err);
      res.json(entry.applications);
    });
  })


  //Metoda koja vrsi registraciju aplikacije
  //Postojecem korisnik dodaje svoju aplikaciju pri cemu se u njegovu listu aplikacija dodaje i ova novokreirana
  //Takodje se novokreiranoj aplikaciju trenutni korisnik postavlja kao owner
  //Unutar req.body paramentra se prosledjuje aplikacija koju dodaje korisnik
  //Unutar req.param se prosledjuje ID korisnika koji  dodaje novu  aplikaciju
  //Funkcija vraca update-ovanu aplikaciju
  //URL: api/applications/user/IDuser
  .post('/user/:id',function(req, res, next) {
    var application = new Application(req.body);
    User.findOne({"_id":req.params.id},function (err, entry) {
      if(err) return next(err);

      application.save(function (err, application) {
          if(err) return next(err); 

          User.findByIdAndUpdate(entry._id, {$push:{"applications":application}}, function (err, entry) {
            if(err) return next(err);
        
            Application.findByIdAndUpdate(application._id, {$set:{owner:entry}}, function (err, entry) {
              Application.findOne({"_id":application.id},function (err, entry) {
                res.json(entry);
             });
            });
          });
        });
      });
  });


//Publikovanje rute aplikacije
module.exports = applicationRouter;