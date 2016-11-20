var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// kreiramo novu shemu
//email, password, ime, prezime, inf.o pridruzenim aplikacijama
var eventSchema = new Schema({
  version: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    unique: false
  },
  name: {
    type: String,
    required: true,
    unique: false
  },
  surname: {
    type: String,
    required: true,
    unique: false
  },
  createdAt: Date
});

//da li se ovako dodaje poddokument????
//userSchema.add({applications:[applicationSchema]});

// prilikom snimanja se postavi datum
userSchema.pre('save', function(next) {

  this.createdAt = new Date();
  // predjemo na sledecu funckiju u lancu
  next();
});

// od sheme kreiramo model koji cemo koristiti
var User = mongoose.model('User', userSchema);

// publikujemo kreirani model
module.exports = User;
