var express = require('express');
var eventRouter = express.Router(); // koristimo express Router

var User = require('../model/user').model;
var Application = require('../model/application').model;
var Event = require('../model/event').model;

eventRouter
  .get('/:id', function(req, res, next) {
    Event.findOne({
      "_id": req.params.id
    })
  })
  .get('/', function(req, res) {
    Event.find({}, function(err, data, next) {
      res.json(data);
    });
  })
   //vrati sve dogadjaje vezane za aplikaciju
  .post('/applicationFilter/:id', function(req, res, next) {
    var fragment = req.body.fragment;
    var version = req.body.version;

    if (fragment == null)
        fragment = "";
    
    if (version == null)
        version = "";

    
    //pretraga bez filtera 
    Application.findOne({
        "_id": req.params.id
    }).populate('events').exec(function(err, entry) {  //ovo reci jovani!!!!!!!
        // ako se desila greska predjemo na sledeci middleware (za rukovanje greskama)
        if (err) return next(err);

        function checkFragment(value) {
            return value.fragment == fragment;
        }

        function checkVersion(value) {
             return value.version == version;
        }

        if (fragment == "" && version == "") {
                res.json(entry.events);
        }

        else if (fragment != "" && version == "") {
            var retVal = (entry.events).filter(checkFragment);
            res.json(retVal);
        }

        else if (fragment == "" && version != "") {
            var retVal = (entry.events).filter(checkVersion);
            res.json(retVal);
        }

        else if (fragment != "" && version != "") {
            var retVal = (entry.events).filter(checkVersion);
            retVal = (entry.events).filter(checkFragment);
            res.json(retVal);
        }

        
    });   
  })
  //Dodavanje dogadjaja aplikaciji
  .post('/application/:id',function(req, res, next) {
    var event = new Event(req.body);
    Application.findOne({"_id":req.params.id},function (err, entry) {
      if(err) return next(err); //greska ako nije pronasao aplikaciju

        event.save(function (err, event) {
          if(err) return next(err); //ako nije snimio dogadjaj

          //doda event u listu
          Application.findByIdAndUpdate(entry._id, {$push:{"events":event}}, function (err, entry) {
            if(err) return next(err); 
        
              Application.findOne({"_id":entry.id},function (err, entry) {
                res.json(entry); //vrati apdejtovan objekat
            })
          });
        });
      });
  });

  module.exports = eventRouter;
