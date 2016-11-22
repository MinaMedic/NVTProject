var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var applicationSchema = require('../model/application').schema;
var commentSchema = require('../model/comment').schema;

// kreiramo novu shemu
//email, password, ime, prezime, inf.o pridruzenim aplikacijama
var userSchema = new Schema({
  email: {
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
  createdAt: Date,
  signedBy: { type: Schema.Types.ObjectId, ref: 'User' }
});

//ovo je lista aplikacija koje je korisnik registrovao i na koje je dodat od strane drugih korisnika
userSchema.add({applications:[applicationSchema]}); 

//aplikacija pamti korisnika koji je registrovao
applicationSchema.add({owner : userSchema});

//commentSchema.add({signedBy:userSchema});

// prilikom snimanja se postavi datum
userSchema.pre('save', function(next) {
  


  this.createdAt = new Date();
  // predjemo na sledecu funckiju u lancu
  next();
});

// od sheme kreiramo model koji cemo koristiti
var User = mongoose.model('User', userSchema);

// publikujemo kreirani model
module.exports.model = User;
module.exports.schema = userSchema;
