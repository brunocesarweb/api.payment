module.exports = function(app){
  app.get('/pagamentos', function(req, res){
    console.log("Recebida a requisição de teste");
    res.send('Ok');
  });

  app.post('/pagamentos/pagamento', function(req,res){

    req.assert("forma_de_pagamento", "Forma de pagamento é obrigatória.").notEmpty();
    req.assert("valor", "Valor é obrigatório e deve ser um decimal.").notEmpty().isFloat();
    req.assert("moeda", "Moeda é obrigatória e deve ter 3 caracteres").notEmpty().len(3,3);

    var errors = req.validationErrors();

    if (errors){
        console.log("Erros de validação encontrados");
        res.status(400).send(errors);
        return;
    };
    console.log('processando pagamento...');

    var pagamento = req.body;
    console.log("processando uma requisicao de um novo pagamento");

    pagamento.status = 'CRIADO';
    pagamento.data = new Date;
    //Inicializando var connection e pagamentoDao
    var connection = app.persistencia.connectionFactory();
    var pagamentoDao = new app.persistencia.PagamentoDao(connection);
    //chamando médoto salva
    pagamentoDao.salva(pagamento, function(erro, resultado){
      if (erro) {
        console.log("Erro ao inserir no banco: " + erro);
        res.status(400).send(erro);
      }else{
        console.log("Pagamento criado");
        res.json(pagamento);
      }
    });

  });

}

/*
REQUISIÇÕES DAS APIs

curl http://localhost:3001/pagamentos/pagamento -X POST -v -H "Content-type: application/json" -d @files/pagamento.json; echo

curl http://localhost:3001/pagamentos/pagamento -X POST -v -H "Content-type: application/json" -d @files/pagamento.json | json_pp

*/
