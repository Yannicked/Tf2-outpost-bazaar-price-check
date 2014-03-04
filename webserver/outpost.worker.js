self.addEventListener(\'message\', function(e) {
  	console.log(e.data);
	var cached_trades = JSON.parse(e.data).cached_trades;
	var class_name = JSON.parse(e.data).class_name;
	var trades = 0;
	for (var i = 0; i<cached_trades.length; i++) {
		if (trades == 20) {
			break;
		}
		console.log(cached_trades[i].classes);
		if (cached_trades[i].classes.indexOf(class_name) != -1) {
			self.postMessage(cached_trades[i].data);
			trades++;
		}
	}
	self.postMessage(\'end\');
}, false);
