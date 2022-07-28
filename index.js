const axios = require("axios");
var express = require('express');
var app = express();
var PORT = 80;

// View engine setup
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/', async function (req, res) {
  res.render('index');

});

app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});