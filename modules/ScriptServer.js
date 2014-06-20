var socketio = fs.readFileSync('webserver/socket.io.min.js');
var bazaar = fs.readFileSync('webserver/bazaar.js');
var outpost = fs.readFileSync('webserver/outpost.js');
var outpostworker = fs.readFileSync('webserver/outpost.worker.js');
var icon = fs.readFileSync('webserver/icon.png');
var outpostcss = fs.readFileSync('webserver/outpost.css');
var classes_item_index = fs.readFileSync('webserver/classes_item_index');
http.createServer(function(request,response){
	var url_parts = url.parse(request.url, true);
	var query = url_parts.query;
	switch (query['script']) {
		case 'socketIO':
			response.writeHead(200, {'Content-Type': 'text/javascript'});
			response.write(socketio);
			break;
		case 'bazaar':
			response.writeHead(200, {'Content-Type': 'text/javascript'});
			response.write(bazaar);
			break;
		case 'outpost':
			response.writeHead(200, {'Content-Type': 'text/javascript'});
			response.write(outpost);
			break;
		case 'outpost.worker':
			response.writeHead(200, {'Content-Type': 'text/javascript'});
			response.write(outpostworker);
			break;
		case 'classes_item_index':
			response.writeHead(200, {'Content-Type': 'text/javascript'});
			response.write(classes_item_index);
			break;
	}
	switch (query['get']) {
		case 'icon':
			response.writeHead(200, {'Content-Type': 'image/png'});
			response.write(icon);
			break;
		case 'outpostcss':
			response.writeHead(200, {'Content-Type': 'text/css'});
			response.write(outpostcss);
			break;
	}
	response.end();
}).listen(8020);

setInterval(function () {
	fs.readFile('webserver/socket.io.min.js', function (err, data) {
		if (err) throw err;
		socketIO = data;
	});
	fs.readFile('webserver/outpost.css', function (err, data) {
		if (err) throw err;
		outpostcss = data;
	});
	fs.readFile('webserver/outpost.worker.js', function (err, data) {
		if (err) throw err;
		outpostworker = data;
	});
	fs.readFile('webserver/icon.png', function (err, data) {
		if (err) throw err;
		icon = data;
	});
	fs.readFile('webserver/bazaar.js', function (err, data) {
		if (err) throw err;
		bazaar = data;
	});
	fs.readFile('webserver/outpost.js', function (err, data) {
		if (err) throw err;
		outpost = data;
	});
	fs.readFile('webserver/classes_item_index', function (err, data) {
		if (err) throw err;
		classes_item_index = data;
	});
}, 10000);