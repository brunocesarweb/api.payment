module.exports = function(app){
  app.get('/pagamentos', function(req, res){
    console.log("Recebida a requisição de teste");
    res.send('Ok');
  });

  app.get('/pagamentos/pagamento/:id', function(req, res){
    var id = req.params.id;
    console.log('consultando pagamento: ' + id);

    var connection = app.persistencia.connectionFactory();
    var pagamentoDao = new app.persistencia.PagamentoDao(connection);

    pagamentoDao.buscaPorId(id, function(erro, resultado){
      if (erro) {
        console.log('Erro ao consultar no banco: ' + erro);
        res.status(500).send(erro);
        return;
      }
      console.log(resultado);
      console.log('Pagamento encontrado: ' + JSON.stringify(resultado));
      res.json(resultado);
      return;
    });

  });

  app.delete('/pagamentos/pagamento/:id', function(req, res){

    var pagamento = {};
    var id = req.params.id;

    pagamento.id = id;
    pagamento.status = 'CANCELADO';

    var connection = app.persistencia.connectionFactory();
    var pagamentoDao = new app.persistencia.PagamentoDao(connection);

    pagamentoDao.atualiza(pagamento, function(erro){

      if(erro){
        res.status(500).send(erro);
        return;
      }
      console.log("pagamento cancelado");
      res.status(204).send(pagamento);

    });

  });

  //Requisição que atualiza o pagamento no banco
  app.put('/pagamentos/pagamento/:id', function(req, res){

    var pagamento = {};
    var id = req.params.id;

    pagamento.id = id;
    pagamento.status = 'CONFIRMADO';

    var connection = app.persistencia.connectionFactory();
    var pagamentoDao = new app.persistencia.PagamentoDao(connection);

    pagamentoDao.atualiza(pagamento, function(erro){

      if(erro){
        res.status(500).send(erro);
        return;
      }

      console.log("pagamento criado");
      res.send(pagamento);

    });

  });

  //Faz o post de pagamento no db
  app.post('/pagamentos/pagamento', function(req,res){

    req.assert("pagamento.forma_de_pagamento", "Forma de pagamento é obrigatória.").notEmpty();
    req.assert("pagamento.valor", "Valor é obrigatório e deve ser um decimal.").notEmpty().isFloat();
    req.assert("pagamento.moeda", "Moeda é obrigatória e deve ter 3 caracteres").notEmpty().len(3,3);

    var errors = req.validationErrors();

    if (errors){
        console.log("Erros de validação encontrados");
        res.status(400).send(errors);
        return;
    };
    console.log('processando pagamento...');

    var pagamento = req.body["pagamento"];
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
        res.status(500).send(erro);

      }else{

        pagamento.id = resultado.insertId;
        console.log("Pagamento criado");

        //Se caso a forma de pagamento for cartão iremos consumir os dados do cartão
        if (pagamento.forma_de_pagamento == 'cartao') {

          var cartao = req.body["cartao"];
          //console.log("cartao--> " + cartao);

          var clienteCartoes = new app.servicos.clienteCartoes();

          clienteCartoes.autoriza(cartao,
            function(exception, request, response, retorno){
            if(exception){
              console.log(exception);
              //Response da requisição de criar pagamento
              res.status(400).send(exception);
              return;
            }

            console.log(retorno);

            res.location('/pagamentos/pagamento/' + pagamento.id);

            var response = {
              dados_de_pagamento: pagamento,
              cartao: retorno,
              links: [
                {
                  href:"http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                  rel:"confirmar",
                  method:"PUT"
                },
                {
                  href:"http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                  rel:"cancelar",
                  method:"DELETE"
                }
              ]
            }

            //console.log("retorno-> " + retorno);
            res.status(201).json(response);
            return;

          });

        }else{

          res.location('/pagamentos/pagamento/' + pagamento.id);

          var response = {
            dados_de_pagamento: pagamento,
            links: [
              {
                href:"http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                rel:"confirmar",
                method:"PUT"
              },
              {
                href:"http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                rel:"cancelar",
                method:"DELETE"
              }
            ]
          }
        }

        res.status(201).json(response);

      }

    });

  });

}


/*
Existem diversos status code HTTP , conhecê-los e utilizá-los corretamente é extremamente importante para o bom desenho de uma api REST. Veja abaixo alguns dos principais códigos e seus significados:
100 Continue: o servidor recebeu a solicitação e o cliente pode continuar a comunicação.
200 Ok: tudo ocorreu como esperado.
201 Created: um novo recurso foi criado no servidor.
301 Moved: a url solicitada foi movida.
400 Bad Request: problemas na requisição do cliente.
404 Not Found: a url solicitada não foi encontrada.
500 Internal Server Error: algo inesperado aconteceu do lado do servidor
Status code link:
https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
-------------------------------------------------------------------------------------------------------------------
REQUISIÇÕES DAS APIs
Requisições post
curl http://localhost:3000/pagamentos/pagamento -X POST -v -H "Content-type: application/json" -d @files/pagamento.json; echo
curl http://localhost:3000/pagamentos/pagamento -X POST -v -H "Content-type: application/json" -d @files/pagamento.json | json_pp

Requisições put
curl -X PUT http://localhost:3000/pagamentos/pagamento/10 -v

Requisições delete
curl -X DELETE http://localhost:3000/pagamentos/pagamento/10 -v
*/
