var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})


// var express = require('express');
// var app = express();
//
//
// app.use(express.static(__dirname+'/www'));
//
// var server = app.listen(8082, function(){
// 	var port = server.address().port;
// 	console.log('port at '+ port);
// })
