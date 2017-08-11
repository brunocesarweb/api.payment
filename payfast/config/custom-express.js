var express = require("express");
var consign = require("consign");
var bodyParser = require("body-parser");
var expressValidator = require("express-validator");

module.exports = function(){
  var app = express();
  //O consign é um load melhorado, é uma versão melhor do load.
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(expressValidator());

  consign()
  .include('controllers')
  .then('persistencia')
  .then('servicos')
  .into(app);

  return app;
}
