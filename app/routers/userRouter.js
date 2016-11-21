var express = require('express');
var User = require('../model/user').model;
var userRouter = express.Router(); // koristimo express Router
var Application = require('../model/application').model;

// definisanje ruta za blog
userRouter
  .get('/:id', function(req, res, next) {
    User.findOne({
      "_id": req.params.id
    }).populate('applications').exec(function(err, entry) {
      // ako se desila greska predjemo na sledeci middleware (za rukovanje greskama)
      if (err) return next(err);
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
      if (err) return next(err);

      res.json(entry);

    });
  })
  .post('/login', function(req, res, next) {
    var email = req.body.email;
    var pass = req.body.password;
    User.findOne({"email":email},function (err, entry) {
      if(err) return next(err);
      if (pass != entry.password) {
        return next(err)
      }
      res.json(entry);
    });
  })
  //DODAVANJE KORISNIKA APLIKACIJI
  //saljemo id aplikacije
  //u bodi saljemo usera koji cemo zakaciti na app
   .post('/application/:id',function(req, res, next) {
    var user = new User(req.body);
    Application.findOne({"_id":req.params.id},function (err, entry) {
      if(err) return next(err); //greska ako nije pronasao aplikaciju

          Application.findByIdAndUpdate(entry._id, {$push:{"users":user}}, function (err, application) {
            if(err) return next(err); //ako nije uspeo aplikaciji da doda korisnika
            
            //kako da vratimo apdejtovan objekat da ne pristupamo bazi 100 puta?? :D :D :D
              Application.findOne({"_id":application.id},function (err, entry) {
                res.json(entry); //vrati apdejtovan objekat
             })
          });
        
      });
  });

  module.exports = userRouter;