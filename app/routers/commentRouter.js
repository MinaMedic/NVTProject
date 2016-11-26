var express = require('express');
var commentRouter = express.Router(); // koristimo express Router


//Importovanje postojecih dokumenata
var Comment = require('../model/comment').model;
var Event = require('../model/event').model;


//Definisanje ruta za komentar
commentRouter
  //Metoda koja vraca sve komentare
  //URL: api/users
  .get('/', function(req, res) {
    Comment.find({}, function(err, data, next) {
      res.json(data);
    });
  })


  //Metoda koja vraca komentar na osnovu prosledjenog ID-a
  //Sa populate('comments') sa koemntarom vracamo i listu svih njegovih podkomentara
  //URL: api/comments/id
  .get('/:id', function(req, res, next) {
    Comment.findOne({
      "_id": req.params.id
    }).populate('comments').exec(function(err, entry) {
      if (err) return next(err);
      res.json(entry);
    });
  })


  //Metoda koja u postojeci dogadjaj dodaje novi komentar
  //Unutar req.body paramentra se prosledjuje komentar koji se dodaje na dogadjaj
  //Unutar req.param se prosledjuje ID dogadjaja kojem se dodaje novi komentar
  //Funkcija vraca update-ovani dogadjaj
  //URL: api/comments/event/IDevent
  .post('/event/:id',function(req, res, next) {
  var comment = new Comment(req.body);

  Event.findOne({"_id":req.params.id},function (err, entry) {
    if(err) return next(err);

    comment.save(function (err, comment) {
      if(err) return next(err);

      Event.findByIdAndUpdate(entry._id, {$push:{"comments":comment._id}}, function (err, entry) {
        if(err) return next(err);

        Event.findOne({"_id":entry.id},function (err, entry) {
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
 .post('/comment/:id',function(req, res, next) {
  var comment = new Comment(req.body);

  Comment.findOne({"_id":req.params.id},function (err, entry) {
    if(err) return next(err);

    comment.save(function (err, comment) {
      if(err) return next(err);

      Comment.findByIdAndUpdate(entry._id, {$push:{"comments":comment._id}}, function (err, entry) {
        if(err) return next(err);

        Comment.findOne({"_id":entry.id},function (err, entry) {
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
  Comment.remove({"_id":req.params.id},function (err, successIndicator) {
    if(err) next(err);
    res.json(successIndicator);
  });
});


//Publikujemo rute komentara
 module.exports = commentRouter;

