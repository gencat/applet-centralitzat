var express = require('express');
var bodyParser = require('body-parser');
var app = express();

const PORT = process.env.PORT || 3000; 

var lastSignatures = {}

app.use(bodyParser.json());

app.use("/demo", express.static('static'));

app.post('/demo/receiveSignature', function(req, res){
	console.log(req.body.signResult);
	console.log(req.body.token);
	lastSignatures[req.body.token] = req.body.signResult;
	res.send();
});

app.post('/demo/checkReceiveSignature', function(req, res){
	var token = req.body.token;
	var signatureContent = lastSignatures[token];
	delete lastSignatures[token];
	res.send(signatureContent);
});

var server = app.listen(PORT, function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log('Listening at http://%s:%s', host, port);
})
