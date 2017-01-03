var express = require('express');
var commentRouter = express.Router(); // koristimo express Router


//Importovanje postojecih dokumenata
var Comment = require('../model/comment').model;
var Event = require('../model/event').model;


//Definisanje ruta za komentar
commentRouter
  //Metoda koja vraca sve komentare
  //URL: api/comments
  .get('/', function (req, res) {
    Comment.find({}, function (err, data, next) {
      res.json(data);
    });
  })

  //Metoda koja vraca sve komentare jednog komentara
  //Unutar req.param paramentra se prosledjuje id komentara za koji trazimo komentare
  //URL: api/comments/all/:id
  .get('/all/:id', function (req, res) {
   
    Comment.findOne({
      "_id": req.params.id  //posaljem id komentara cije komentare hocu
    }).populate('comments').exec(function (err, entry) {
      if (err) return next(err);
      var retVal = [];
      var n = 0;
      for (i = 0; i < entry.comments.length; i++) {  //prodjem krosz te komentare
        Comment.findOne({  //pronadjem svaki od njih
          "_id": entry.comments[i]
        }).exec(function (err, com) {
          if (err) return next(err);
          retVal.push(com);
          n++;
          if(n == entry.comments.length){  //ovo ovde da bi sacekalo da se zavrse svi pozivi
            res.json(retVal);
          }
        });
      }
    });
  })

  //Metoda koja vraca komentar na osnovu prosledjenog ID-a
  //Sa populate('comments') sa koemntarom vracamo i listu svih njegovih podkomentara
  //URL: api/comments/id
  .get('/:id', function (req, res, next) {
    Comment.findOne({
      "_id": req.params.id
    }).populate('comments').exec(function (err, entry) {
      if (err) return next(err);
      res.json(entry);
    });
  })


  //Metoda koja u postojeci dogadjaj dodaje novi komentar
  //Unutar req.body paramentra se prosledjuje komentar koji se dodaje na dogadjaj
  //Unutar req.param se prosledjuje ID dogadjaja kojem se dodaje novi komentar
  //Funkcija vraca update-ovani dogadjaj
  //URL: api/comments/event/IDevent
  .post('/event/:id', function (req, res, next) {
    var comment = new Comment(req.body);

    Event.findOne({ "_id": req.params.id }, function (err, entry) {
      if (err) return next(err);

      comment.save(function (err, comment) {
        if (err) return next(err);

        Event.findByIdAndUpdate(entry._id, { $push: { "comments": comment._id } }, function (err, entry) {
          if (err) return next(err);

          Event.findOne({ "_id": entry.id }, function (err, entry) {
            res.json(entry);
          });
        });
      });
    });
  })


  //Metoda koja u postojeci komentar dodaje novi komentar
  //Unutar req.body paramentra se prosledjuje komentar koji se dodaje na postojeci komentar
  //Unutar req.param se prosledjuje ID koemntara kojem se dodaje podkomentar
  //Funkcija vraca update-ovani komentar
  //URL: api/comments/comment/IDcomment
  .post('/comment/:id', function (req, res, next) {
    var comment = new Comment(req.body);

    Comment.findOne({ "_id": req.params.id }, function (err, entry) {
      if (err) return next(err);

      comment.save(function (err, comment) {
        if (err) return next(err);

        Comment.findByIdAndUpdate(entry._id, { $push: { "comments": comment._id } }, function (err, entry) {
          if (err) return next(err);

          Comment.findOne({ "_id": entry.id }, function (err, entry) {
            res.json(entry);
          });
        });
      });
    });
  })


  //Metoda koja brise postojeci komentar
  //Unutar req.param se prosledjuje ID komentara koji brisemo
  //URL: api/comemnts/IDcomment
  .delete('/:id', function (req, res, next) {
    Comment.remove({ "_id": req.params.id }, function (err, successIndicator) {
      if (err) next(err);
      res.json(successIndicator);
    });
  });


//Publikujemo rute komentara
module.exports = commentRouter;

