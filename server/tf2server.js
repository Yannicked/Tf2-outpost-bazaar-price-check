// imports
var request = require('request');
var url = require('url');
var io = require('socket.io').listen(2070);
var sqlite3 = require('sqlite3');
var fs = require('fs');

// module imports
eval(fs.readFileSync('modules/PriceListHandler.js')+'');
eval(fs.readFileSync('modules/UpdateHandler.js')+'');
eval(fs.readFileSync('modules/DisplayHandler.js')+'');

// loglevel
io.set('log level', 1);

//vars
var prices = {};
var usernames = {};
var steamIDs = {};
var pricelistLOG = 'Current pricelist includes:\nRefined:  usd\nKey:  Refined\nEarbuds:  Keys\n';
var quality = {1:'genuine',3:'vintage',5:'unusual',6:'unique',11:'strange', 13:'haunted',600:'uncraftable'};
var clients = [];


io.sockets.on('connection', function(socket) {
	var endpoint = socket.manager.handshaken[socket.id].address;
  	clients.push(endpoint.address);
	update();
	socket.on('disconnect', function() {
		var i = clients.indexOf(endpoint.address);
      		delete clients[i];
		update();
	});
	socket.on('username', function(received) {
		received = JSON.parse(received);
		usernames[endpoint.address] = received['username'];
		steamIDs[endpoint.address] = received['steamID'];
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
		sqlQueryString = 'SELECT * FROM "'+itemPrice[0]+'" WHERE quality='+itemPrice[1]+' AND effect='+itemPrice[2];
		sendPrice(socket, sqlQueryString, index, item);
		//console.log(sqlQueryString);
		
		} catch(err){
			socket.emit('pc', JSON.stringify({'price':'n/a','index':index}));
		}
	})
});

setInterval(update, 2000);
setInterval(getPrices, 3600000);
getPrices();