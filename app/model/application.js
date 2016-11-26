var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//Importovanje postojecih sema
var eventSchema = require('../model/event').schema;


//Kreiranje nove seme sa zadatatim poljima
var applicationSchema = new Schema({
  domain: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
    dropDups: true
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
  updatedAt: Date,
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  users: [{ type: Schema.Types.ObjectId, ref: 'User'}],
  events: [{ type: Schema.Types.ObjectId, ref: 'Event'}]
});


//Svaka aplikacija cuva listu svih dogadjaja koji su se desili unutar nje
//applicationSchema.add({events:[eventSchema]}); 


//Funkcija koja snima aplikaciju
//Automatski se dodaje datum kreiranja aplikacije
//Automastki se azurira datum azuriranja aplikacije
//Na kraju se automatski prelazi na sledecu funkciju u lancu
applicationSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updatedAt = currentDate;
  if (!this.createdAt)
    this.createdAt = currentDate;
  next();
});


//Od seme kreiramo model koji cemo koristiti
var Application = mongoose.model('Application', applicationSchema);


//Publikujemo model i semu
module.exports.model = Application;
module.exports.schema = applicationSchema;
