var soap = require('soap');

function CorreiosSOAPClient(){
  this._url = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';
}

module.exports = function(){
  return CorreiosSOAPClient;
}

CorreiosSOAPClient.prototype.calculaPrazo = function(args, callback){

  soap.createClient(this._url, function(erro, cliente){
      console.log('cliente soap criado');
      cliente.CalcPrazo(args,callback);
    });

}


/*
Links dos serviços do correios
http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl
http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx
http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?op=CalcPrazo

Fazer post via console
curl http://localhost:3000/pagamentos/pagamento -X POST http://localhost:3000/correios/calculo-prazo -H "Content-type: application/json" -d @files/dados-entrega.json
curl http://localhost:3000/pagamentos/pagamento -X POST http://localhost:3000/correios/calculo-prazo -H "Content-type: application/json" -d @files/dados-entrega.json
*/
