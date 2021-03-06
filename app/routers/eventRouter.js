var express = require('express');
var eventRouter = express.Router(); // koristimo express Router

var MailSender = require('../email');


//Importovanje postojecih dokumenata
var User = require('../model/user').model;
var Application = require('../model/application').model;
var Event = require('../model/event').model;


//Definisanje ruta za dogadjaj
eventRouter
  //Metoda koja vraca dogadjaj na osnovu prosledjenog ID-a
  //URL: api/events/id
  .get('/:id', function (req, res, next) {
    Event.findOne({
      "_id": req.params.id
    }).populate('comments').exec(function (err, entry) {
      if (err) return next(err);
      res.json(entry);
    });
  })


  //Metoda koja vraca sve dogadjaje
  //URL: api/events
  .get('/', function (req, res) {
    Event.find({}, function (err, data, next) {
      res.json(data);
    });
  })

  //Metoda koja vraca sve dogadjaje iz istog fragmenta jedne aplikacije
  //Funkcija prvo pronalazi aplikaciju u kojoj se nalazi dogadjaj, zatim uzima njene sve dogadjaje i proverava da li je isti fragment
  //Unutar req.param se prosledjuje id dogadjaja
  //Unutar req.body se prosledjuje fragment
  //Funkcija vraca listu dogadjaja iz istog fragmenta
  //URL: api/events/fragments/idEvent-a
  .post('/fragments/:id', function (req, res) {
    var fragment = req.body.fragment;
    var id = req.params.id;
    var retVal = [];
    var n = 0;
    Application.find({}, function (err, data, next) {
      for (i = 0; i < data.length; i++) {
        for (j = 0; j < data[i].events.length; j++) {
          if (data[i].events[j] == id) {
            events = data[i].events;
            for (k = 0; k < events.length; k++) {
              Event.findOne({
                "_id": events[k]
              }).exec(function (err, entry) {
                if (err) return next(err);
                n++;
                if (entry.fragment == fragment) {
                  retVal.push(entry);
                  if (n == events.length) {
                    res.json(retVal);
                  }
                }
              });
            }
          }
        }
      }
    });
  })


  //Metoda koja vraca sve dogadjaje vezane za odredjenu aplikaciju
  //Ova metoda ujedno radi i filtriranje dogadjaja na osnovu fragmenta ili verzije aplikacije na kojoj se desio dogadjaj
  //Unutar req.body parametra se mogu proslediti fragment i verzija
  //Unutar req.param se prosledjuje ID aplikacije ciji se dogadjaji prikazuju
  //URL: api/events/applicationFilter/IDapp
  .post('/applicationFilter/:id', function (req, res, next) {
    var fragment = req.body.fragment;
    var version = req.body.version;

    if (fragment == null)
      fragment = "";

    if (version == null)
      version = "";

    Application.findOne({
      "_id": req.params.id
    }).populate('events').exec(function (err, entry) {
      if (err) return next(err);

      //pomocna funkcija za filtriranje po fragmentu
      function checkFragment(value) {
        return value.fragment == fragment;
      }

      //pomocna funkcija za filtriranje po verziji
      function checkVersion(value) {
        return value.version == version;
      }

      //pretraga bez filtera
      if (fragment == "" && version == "") {
        res.json(entry.events);
      }

      //pretraga sa fragment filterom
      else if (fragment != "" && version == "") {
        var retVal = (entry.events).filter(checkFragment);
        res.json(retVal);
      }

      //pretraga sa verzija filterom
      else if (fragment == "" && version != "") {
        var retVal = (entry.events).filter(checkVersion);
        res.json(retVal);
      }

      //pretraga po oba filtera
      else if (fragment != "" && version != "") {
        var retVal = (entry.events).filter(checkVersion);
        retVal = (entry.events).filter(checkFragment);
        res.json(retVal);
      }
    });
  })


  //Metoda koja u postojecu aplikaciju dodaje novi dogadjaj
  //Unutar req.body paramentra se prosledjuje objekat dogadjaja koji se dodaje
  //Unutar req.param se prosledjuje ID aplikacije kojoj se dodaje novi dogadjaj
  //Funkcija vraca update-ovanu aplikaciju
  //URL: api/events/application/IDapp
  .post('/application/:id', function (req, res, next) {
    var event = new Event(req.body);

    Application.findOne({ "_id": req.params.id }, function (err, entry) {
      if (err) return next(err);

      event.save(function (err, event) {
        if (err) return next(err);

        //Application.findByIdAndUpdate(entry._id, {$push:{"events":event}}, function (err, entry) {
        Application.findByIdAndUpdate(entry._id, { $push: { "events": event._id } }, function (err, entry) {
          if (err) return next(err);

          Application.findOne({ "_id": entry.id }, function (err, entry) {

            MailSender.sendMail(entry, event); //posalji mejl

            res.json(entry); //vrati apdejtovan objekat
          })
        });
      });
    });
  });


//Publikujemo rute dogadjaja
module.exports = eventRouter;
