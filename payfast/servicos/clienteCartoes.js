var restify = require('restify');

var cliente = restify.createJsonClient({
  url: 'http://localhost:3001'
});

cliente.post('/cartoes/autoriza', cartao, function(erro, req, res, retorno){
  console.log("consumindo servico de cartoes");
  console.log(retorno);
});

/*
var restify = require('restify');

function CartoesClient() {
  this._client = restify.createJsonClient({
    url: 'http://localhost:3001',
    version: '~1.0'
  });
}

CartoesClient.prototype.autoriza = function(cartao, callback) {
  this._client.post('/cartoes/autoriza', cartao, callback);
}

module.exports = function(){
    return CartoesClient;
};
*/
