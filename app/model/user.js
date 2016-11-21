var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var applicationSchema = require('../model/application').schema;

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
  createdAt: Date
  //applications: [{type : Schema.Types.ObjectId, ref:'Application'}]
});

//da li se ovako dodaje poddokument????
userSchema.add({applications:[applicationSchema]});

applicationSchema.add({users : [userSchema] });
applicationSchema.add({owner : [userSchema]});

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
