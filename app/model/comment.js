var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 

//Kreiranje nove seme sa zadatatim poljima
var commentSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  createdAt: Date,
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment'}],
  signedBy: { type: Schema.Types.ObjectId, ref: 'User' },
});



//Svaki komentar ima listu podkomentara
//commentSchema.add({comments:[commentSchema]});


//Funkcija koja snima komentar
//Automatski se dodaje datum kreiranja komentara
//Na kraju se automatski prelazi na sledecu funkciju u lancu
commentSchema.pre('save', function(next) {
    this.createdAt = new Date();
    next();
});


//Od seme kreiramo model koji cemo koristiti
var Comment = mongoose.model('Comment', commentSchema);


//Publikujemo kreirani model i semu
module.exports.model = Comment;
module.exports.schema = commentSchema;
