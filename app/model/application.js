var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = require('../model/event').schema;

// kreiramo novu shemu
//ime, opis tehnologije, najskoriju verizuju(nije req), link ka rep (nije req), dogadjaji, domen(ID)
var applicationSchema = new Schema({
  domain: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: false
  },
  description: {
    type: String,
    required: true,
    unique: false
  },
  version: {
    type: String,
    required: false,
    unique: false
  },
  repo: {
    type: String,
    required: false,
    unique: false
  },
  createdAt: Date,
  updatedAt: Date
});

//lista dogadjaja koji su se desili u aplikaciji
applicationSchema.add({events:[eventSchema]}); 

// prilikom snimanja se postavi datum
applicationSchema.pre('save', function(next) {


 // preuzmemo trenutni datum
  var currentDate = new Date();

  // postavimo trenutni datum poslednju izmenu
  this.updatedAt = currentDate;

  // ako nije postavljena vrednost za createdAt, postavimo je
  if (!this.createdAt)
    this.createdAt = currentDate;

  // predjemo na sledecu funckiju u lancu
  next();
});

// od sheme kreiramo model koji cemo koristiti
var Application = mongoose.model('Application', applicationSchema);

// publikujemo kreirani model
module.exports.model = Application;
module.exports.schema = applicationSchema;
