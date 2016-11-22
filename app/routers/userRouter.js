var express = require('express');
var User = require('../model/user').model;
var userRouter = express.Router(); // koristimo express Router
var Application = require('../model/application').model;

// definisanje ruta za blog
userRouter
  .get('/:id', function(req, res, next) {
    User.findOne({
      "_id": req.params.id
    }).populate('applications').exec(function(err, entry) {  //ovo reci jovani!!!!!!!
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
    console.log(user)
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
    //ovo je korisnik koji treba da se doda
    var user = new User(req.body); 

    //trazi aplikaciju kojoj se dodaje korisnik
    Application.findOne({"_id":req.params.id},function (err, entry) {
      if(err) return next(err); //greska ako nije pronasao aplikaciju

          //korisniku u listu aplikacija dodajemo novu
          User.findByIdAndUpdate(user._id, {$push:{"applications":entry}}, function (err, application) {
            if(err) return next(err); //ako nije uspeo aplikaciji da doda korisnika
            
             User.findOne({"_id":user._id},function (err, entry) {
                res.json(entry); //vrati apdejtovan objekat
             })
          });
        
      });
  });

  module.exports = userRouter;