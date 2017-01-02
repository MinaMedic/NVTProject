var express = require('express');
var userRouter = express.Router(); // koristimo express Router


//Importovanje postojecih dokumenata
var User = require('../model/user').model;
var Application = require('../model/application').model;


//Definisanje ruta za korisnika
userRouter
  //Metoda koja vraca korisnika na osnovu prosledjenog ID-a
  //Sa populate('applications') sa korisnikom vracamo i listu svih njegovih aplikacija
  //URL: api/users/id
  .get('/:id', function(req, res, next) {
    User.findOne({
      "_id": req.params.id
    }).populate('applications').exec(function(err, entry) {
      if (err) return next(err);
      res.json(entry);
    });
  })


  //Metoda koja vraca sve korisnike
  //URL: api/users
  .get('/', function(req, res) {
    User.find({}, function(err, data, next) {
      res.json(data);
    });
  })


  //Metoda koja registruje novog korisnika
  //Unutar req.body paramentra se prosledjuje JSON objekat korisnika
  //URL: api/users
  .post('/', function(req, res, next) {
    var user = new User(req.body);
    user.save(function(err, entry) {
      if (err) return next(err);
      res.json(entry);

    });
  })


  //Metoda koja loguje postojeceg korisnika
  //Unutar req.body paramentra se prosledjuju email i password korisnika
  //URL: api/users/login
  .post('/login', function(req, res, next) {
    var email = req.body.email;
    var pass = req.body.password;

    User.findOne({"email":email},function (err, entry) {
     // if(err) return next(err);
      if(entry ==  null){
        res.send(JSON.stringify({ message: 'User not found' }));
        return next(err);
      } 
      else if (pass != entry.password) {
        return next(err)
      }
      res.json(entry);
    });
  })


 //Metoda koja u postojecu aplikaciju dodaje novog korisnika
 //Unutar req.body paramentra se prosledjuje korisnik koji se dodaje na aplikaciju
 //Unutar req.param se prosledjuje ID aplikacije kojoj se dodaje novi korisnik
 //Funkcija vraca update-ovanog korisnika
 //URL: api/users/application/IDapp
 .post('/application/:id',function(req, res, next) {
    var user = new User(req.body); 

    //Application.findOne({"_id":req.params.id},function (err, entry) {
    Application.findByIdAndUpdate(req.params.id, {$push:{"users":user._id}}, function (err, entry) {
      if(err) return next(err);

      Application.findOne({"_id":entry._id},function (err, entry) {
        if(err) return next(err); 

          //User.findByIdAndUpdate(user._id, {$push:{"applications":entry}}, function (err, application) {
            User.findByIdAndUpdate(user._id, {$push:{"applications":entry._id}}, function (err, application) {
              if(err) return next(err); 

              User.findOne({"_id":user._id},function (err, entry) {
                  res.json(entry); 
              })
            });
        });
      });
  })


 //Metoda koja u postojecu aplikaciju dodaje novog korisnika
 //Unutar req.body paramentra se prosledjuje ID korisnik-a koji se dodaje na aplikaciju
 //Unutar req.param se prosledjuje ID aplikacije kojoj se dodaje novi korisnik
 //Funkcija vraca update-ovanog korisnika
 //URL: api/users/applicationNew/IDapp
 .post('/applicationNew/:id',function(req, res, next) {
    User.findOne({"_id":req.body._id},function (err, entryUser) {
      if(err) return next(err);

      //Application.findOne({"_id":req.params.id},function (err, entry) {
      Application.findByIdAndUpdate(req.params.id, {$push:{"users":entryUser._id}}, function (err, entry) {
      if(err) return next(err);

      //User.findByIdAndUpdate(entryUser._id, {$push:{"applications":entry}}, function (err, application) {
        User.findByIdAndUpdate(entryUser._id, {$push:{"applications":entry._id}}, function (err, application) {
            if(err) return next(err); 
            
            User.findOne({"_id":entryUser._id},function (err, entry) {
                res.json(entry); 
             })
          });
       });
    });
  });



//Publikujemo rute korisnika
module.exports = userRouter;