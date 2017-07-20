module.exports = function(app){
  app.get('/pagamentos', function(req, res){
      console.log("Recebida a requisição de teste");
      res.send('Ok');
  });
}
