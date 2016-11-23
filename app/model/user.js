var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//Importovanje postojecih sema
var applicationSchema = require('../model/application').schema;
var commentSchema = require('../model/comment').schema;


//Kreiranje nove seme sa zadatatim poljima
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


//Svaki korisnik cuva listu svih aplikacija koje je on kreirao (tj. ciji je owner)
//i svih aplikacija na koje je dodat od strane drugih korisnika
userSchema.add({applications:[applicationSchema]}); 


//Svaka aplikacija cuva poddokument korisnika koji ju je kreirao
//Ovo nije moglo biti dodato unutar application.js fajla zbog problema cirkularne zavisnosti
applicationSchema.add({owner : userSchema});


//Funkcija koja snima aplikaciju
//Automatski se dodaje datum kreiranja aplikacije
//Na kraju se automatski prelazi na sledecu funkciju u lancu
userSchema.pre('save', function(next) {
  this.createdAt = new Date();
  next();
});


//Od seme kreiramo model koji cemo koristiti
var User = mongoose.model('User', userSchema);


//Publikujemo model i semu
module.exports.model = User;
module.exports.schema = userSchema;
