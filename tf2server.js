// imports
var request = require('request');
var url = require('url');
var sqlite3 = require('sqlite3');
var fs = require('fs');
var http = require('http');
var io = require('socket.io')
var cp = require('child_process');
logger  = io.log;

// module imports
eval(fs.readFileSync('modules/PriceListHandler.js')+'');
eval(fs.readFileSync('modules/DisplayHandler.js')+'');
eval(fs.readFileSync('modules/HTTPQueryHandler.js')+'');
eval(fs.readFileSync('modules/UpdateHandler.js')+'');
eval(fs.readFileSync('modules/ScriptServer.js')+'');

/*updateProcess = cp.fork('updatePrices.js');

// update process
updateProcess.on('message', function(m) {
	extraInfo(m);
});*/
setInterval(getPrices, 3600000);
getPrices();
// https server
httpServer = http.createServer();

// socket.io server
io = io.listen(httpServer);
httpServer.listen(2070);

io.set('logger', extraInfoIO)
io.set('log level', 2);

//vars
var prices = {};
var usernames = {};
var steamIDs = {};
var pricelistLOG = 'Current pricelist includes:\nRefined:  usd\nKey:  Refined\nEarbuds:  Keys\n';
var quality = {1:'genuine',3:'vintage',5:'unusual',6:'unique',11:'strange', 13:'haunted',600:'uncraftable'};
var clients = [];
var sites = {};
var sitesList = {};

//exception handling, or just On error
process.on('uncaughtException', function(err) {
	extraInfo('Caught exception: ' + err);
});

io.sockets.on('connection', function(socket) {
	setTimeout(function() {socket.emit('request', 'userInfo');}, 1000);
	var endpoint = socket.manager.handshaken[socket.id].address;
	if (!(sitesList[endpoint.address])) {
		sitesList[endpoint.address] = [];
	}
  	clients.push(endpoint.address);
	socket.on('timestamp', function(msg) {sendTimestamp(socket);});
	socket.on('disconnectreason', function(reason) {extraInfoIO.info('transport end ('+reason+')');})
	socket.on('disconnect', function(reason) {
		var i = clients.indexOf(endpoint.address);
      		delete clients[i];
		update();
	});
	socket.on('username', function(received) {
		received = JSON.parse(received);
		usernames[endpoint.address] = received['username'];
		steamIDs[endpoint.address] = received['steamID'];
		sites[endpoint.address]= received['site'];
		/*if (sitesList[endpoint.address].indexOf('tf2outpost') > -1 && sitesList[endpoint.address].indexOf('bazaar.tf')) {
			sites[endpoint.address] = 'both';
		} else {
			sites[endpoint.address] = received['site'];
		}*/
		update();
	});
	socket.on('pc', function(item){
		
		item = JSON.parse(item);
		index = item['index'];
		itemPrice = item['price'];
		
		try{
		/* This is obsolete
		priceListing = prices[itemPrice[0]][itemPrice[1]][itemPrice[2]]['current'];
		price = parseFloat(priceListing['value']);
		price_high = parseFloat(priceListing['value_high']);
		
		currency = prices[itemPrice[0]][itemPrice[1]][itemPrice[2]]['current']['currency'];
		*/
		sqlQueryString = 'SELECT * FROM prices WHERE id='+itemPrice[0]+' AND quality='+itemPrice[1]+' AND effect='+itemPrice[2];
		sendPrice(socket, sqlQueryString, index, item);
		//console.log(sqlQueryString);
		
		} catch(err){
			socket.emit('pc', JSON.stringify({'price':'n/a','index':index}));
		}
	})
});
process.stdin.resume();

process.on('SIGINT', function () {
	clearInterval(loggerInterval);
	setTimeout(function(){
		process.stdout.write('\033[?25h');
		process.exit();
	}, 50);
});