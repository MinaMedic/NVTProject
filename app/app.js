var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
mongoose.Promise = require('bluebird');


//Importovanje ruta
var userRouter = require('../app/routers/userRouter');
var applicationRouter = require('../app/routers/applicationRouter');
var commentRouter = require('../app/routers/commentRouter');
var eventRouter = require('../app/routers/eventRouter');


//Importovanje modela
var User = require('../app/model/user').model;
var Application = require('../app/model/application').model;
var Event = require('../app/model/event').model;
var Comment = require('../app/model/comment').model;


mongoose.connect('mongodb://localhost/projectNVT');

// konfigurisemo bodyParser()
// da bismo mogli da preuzimamo podatke iz POST zahteva
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


// na kom portu slusa server
var port = process.env.PORT || 8080; 
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // *******************************************************


app.use('/api/users', userRouter);
app.use('/api/applications', applicationRouter);
app.use('/api/events', eventRouter);
app.use('/api/comments', commentRouter);


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


// Klijnetska strana -------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'client')));  //Serviranje statickih fajlova
app.get('', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/index.html'));  //mapiranje na index stranicu
});

// Pokretanje servera
app.listen(port);
console.log('Server radi na portu ' + port);