var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var userRouter = require('../app/routers/userRouter');
var applicationRouter = require('../app/routers/applicationRouter');
// koristimo mongoose model koju smo kreirali u folderu model
var User = require('../app/model/user').model;
var Application = require('../app/model/application').model;

mongoose.connect('mongodb://localhost/projectNVT');

// konfigurisemo bodyParser()
// da bismo mogli da preuzimamo podatke iz POST zahteva
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // na kom portu slusa server



// dodavanje rutera zu users /api/users
app.use('/api/users', userRouter);
app.use('/api/applications', applicationRouter);


//na kraju dodajemo middleware za obradu gresaka
app.use(function(err, req, res, next) {

  var message = err.message;
  var error = err.error || err;
  var status = err.status || 500;

  res.status(status).json({
    message: message,
    error: error
  });
});


// Pokretanje servera
app.listen(port);


console.log('Server radi na portu ' + port);