var socketio = fs.readFileSync('webserver/socket.io.min.js');
var bazaar = fs.readFileSync('webserver/bazaar.js');
var outpost = fs.readFileSync('webserver/outpost.js');
http.createServer(function(request,response){
	var url_parts = url.parse(request.url, true);
	var query = url_parts.query;
	switch (query['script']) {
		case 'socketIO':
			response.write(socketio);
			break;
		case 'bazaar':
			response.write(bazaar);
			break;
		case 'outpost':
			response.write(outpost);
			break;
	}
	response.end();
}).listen(8020);

setInterval(function () {
	fs.readFile('webserver/socket.io.min.js', function (err, data) {
		if (err) throw err;
		socketIO = data;
	});
	fs.readFile('webserver/bazaar.js', function (err, data) {
		if (err) throw err;
		bazaar = data;
	});
	fs.readFile('webserver/outpost.js', function (err, data) {
		if (err) throw err;
		outpost = data;
	});
});