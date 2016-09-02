var serialport = require('serialport');
var MongoClient = require('mongodb').MongoClient;

var _db = null;

var url = 'mongodb://localhost:27017/test';
MongoClient.connect(url, function(err, db) {
  _db = db;
});

var SerialPort = serialport.SerialPort;

var sp = new SerialPort('COM3', { 
	baudrate: 9600, 
	parser: serialport.parsers.readline("\n") 
}); 

sp.on ('open', function () {
    console.log("Open");
    sp.on ('data', function( data ) {
        //console.log("data " + data.toString());
    });
	setInterval(function(){
		_db.collection('foco')
			.aggregate([
				{
					$match: {
						reference: 1
					}
				}	
			]).toArray(function(error, docs){
				//console.log(docs[0]);
				sp.write(docs[0].value, function(){
					console.log("sended: "+docs[0].value);
				});
			});
	},250);
	/*setTimeout(function(){
		sp.write('1', function(){
			console.log("sended");
		});
	}, 3000);*/
});

/*
// Abrimos la conexión al puerto serial
sp.open(function () { 
	// Cada que llegue un dato serial lo imprimiremos en la consola 
	// En este caso convertimos el dato en Entero y lo mostramos como 
	// temperatura en grados celsius. 
	sp.on("data", function (data) { 
		//var temp = parseInt(data, 10) + " ºC";
		console.log(data); 
	}); 
}); 
*/