module.exports = function(app){
  app.get('/pagamentos', function(req, res){
    console.log("Recebida a requisição de teste");
    res.send('Ok');
  });

  app.post('/pagamentos/pagamento', function(req,res){
    var pagamento = req.body;
    console.log("processando uma requisicao de um novo pagamento");

    pagamento.status = 'CRIADO';
    pagamento.data = new Date;
    //Inicializando var connection e pagamentoDao
    var connection = app.persistencia.connectionFactory();
    var pagamentoDao = new app.persistencia.PagamentoDao(connection);
    //chamando médoto salva
    pagamentoDao.salva(pagamento, function(erro, resultado){
      console.log("pagamento criado");
      res.json(pagamento);
    });

  });

}

/*
REQUISIÇÕES DAS APIs

curl http://localhost:3001/pagamentos/pagamento -X POST -v -H "Content-type: application/json" -d @files/pagamento.json; echo

curl http://localhost:3001/pagamentos/pagamento -X POST -v -H "Content-type: application/json" -d @files/pagamento.json | json_pp

*/
