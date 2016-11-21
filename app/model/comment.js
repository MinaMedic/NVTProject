var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = require('../model/user').schema; 

// kreiramo novu shemu
var commentSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  createdAt: Date
});

commentSchema.add({comments:[commentSchema]});
commentSchema.add({signedBy:userSchema});

// prilikom snimanja se postavi datum
commentSchema.pre('save', function(next) {
    this.createdAt = new Date();
  next();
});

// od sheme kreiramo model koji cemo koristiti
var Comment = mongoose.model('Comment', commentSchema);

// publikujemo kreirani model
module.exports.model = Comment;
module.exports.schema = commentSchema;
