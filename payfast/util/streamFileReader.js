var fs = require('fs');

fs.createReadStream('imagem.jpg')
  .pipe(fs.createWriteStream('imagem-com-stream.jpg'))
  .on('finish', function(){
    console.log('arquivo escrito com stream');
  });

/*
Enviar arquivos via upload
curl -X POST http://localhost:3000/upload/imagem --data-binary @imagem.jpg

Enviando arquivo com parametros -H e content type
curl -X POST http://localhost:3000/upload/imagem --data-binary @imagem.jpg -H "Content-type: application/octet-stream" -v

Menos v para uma saida mais verbosa
curl -X POST http://localhost:3000/upload/imagem --data-binary @imagem.jpg -H -v

Enviando a requisição com um nome para a imagem que será feita o upload
curl -X POST http://localhost:3000/upload/imagem --data-binary @imagem.jpg -H "Content-type: application/octet-stream" -v -H "filename: imagem.jpg"
*/
