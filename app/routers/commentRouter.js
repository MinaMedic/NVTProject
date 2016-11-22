var express = require('express');
var Comment = require('../model/comment').model;
var commentRouter = express.Router(); // koristimo express Router
var Event = require('../model/event').model;

commentRouter
.get('/:id', function(req, res, next) {
    Comment.findOne({
      "_id": req.params.id
    }).populate('comments').exec(function(err, entry) {  //ovo reci jovani!!!!!!!
      // ako se desila greska predjemo na sledeci middleware (za rukovanje greskama)
      if (err) return next(err);
      res.json(entry);
    });
 })
//saljemo id dogadjaja koji se komentarise
.post('/event/:id',function(req, res, next) {
  var comment = new Comment(req.body);
  Event.findOne({"_id":req.params.id},function (err, entry) {
    if(err) return next(err);
    comment.save(function (err, comment) {
      if(err) return next(err);
      Event.findByIdAndUpdate(entry._id, {$push:{"comments":comment}}, function (err, entry) {
        if(err) return next(err);

        Event.findOne({"_id":entry.id},function (err, entry) {
            res.json(entry); //vrati apdejtovan objekat

        });
      });
    });
  });
})
//id komentara koji se komentarise
.post('/comment/:id',function(req, res, next) {
  var comment = new Comment(req.body);
  Comment.findOne({"_id":req.params.id},function (err, entry) {
    if(err) return next(err);
    comment.save(function (err, comment) {
      if(err) return next(err);
      Comment.findByIdAndUpdate(entry._id, {$push:{"comments":comment}}, function (err, entry) {
        if(err) return next(err);

        Comment.findOne({"_id":entry.id},function (err, entry) {
            res.json(entry); //vrati apdejtovan objekat

        });
      });
    });
  });
})
.delete('/:id', function (req, res, next) {
  Comment.remove({"_id":req.params.id},function (err, successIndicator) {
    if(err) next(err);
    res.json(successIndicator);
  });
});



  module.exports = commentRouter;

