var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = require('../model/comment').schema;

// kreiramo novu shemu
//Svaka greška za sebe može da ima vezano opciono polje koje govori o verziji aplikacije na kojoj se ta greška dogodila
// Greska ima stack (izuzetak kojem odgovara, vreme nastanka, proizvoljne podatke, fragment 
// koji govori o delu aplikacije gde je greska nastala)
//potrebno je obavestiti sve korisnike vezane za app kad se desi greska
//dogadaj ima komentare
var eventSchema = new Schema({
  version: {
    type: String,
    required: false,
    unique: false
  },
  exception: {
    type: String,
    required: false,
    unique: false
  },
  info: {
    type: String,
    required: false,
    unique: false
  },
  fragment: {
    type: String,
    required: false,
    unique: false
  },
  createdAt: {
    type: Date,
    required: false,
    unique: false
  }
});

eventSchema.add({comments:[commentSchema]});

// prilikom snimanja se postavi datum
eventSchema.pre('save', function(next) {
  this.createdAt = new Date();
  next();
});

// od sheme kreiramo model koji cemo koristiti
var Event = mongoose.model('Event', eventSchema);

// publikujemo kreirani model
module.exports.model = Event;
module.exports.schema = eventSchema;
