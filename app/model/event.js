var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Importovanje postojecih sema
var commentSchema = require('../model/comment').schema;


//Kreiranje nove seme sa zadatatim poljima
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
  },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment'}]
});


//Svaki dogadjaj cuva listu svih svojih komentara
//eventSchema.add({comments:[commentSchema]});


//Funkcija koja snima dogadjaj
//Automatski se dodaje datum kreiranja dogadjaja
//Na kraju se automatski prelazi na sledecu funkciju u lancu
eventSchema.pre('save', function(next) {
  this.createdAt = new Date();
  next();
});


// od sheme kreiramo model koji cemo koristiti
var Event = mongoose.model('Event', eventSchema);


//Publikujemo model i semu
module.exports.model = Event;
module.exports.schema = eventSchema;
