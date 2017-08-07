var mysql  = require('mysql');

function createDBConnection(){
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'payfast'
  });
}

module.exports = function() {
  return createDBConnection;
}
/*
Banco de dados
CREATE SCHEMA `payfast` ;

CREATE TABLE `pagamentos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
`forma_de_pagamento` varchar(255) NOT NULL,
`valor` decimal(10,2) NOT NULL,
`moeda` varchar(3) NOT NULL,
`status` varchar(255) NOT NULL,
`data` DATE,
`descricao` text,
 PRIMARY KEY (id)
);


*/
