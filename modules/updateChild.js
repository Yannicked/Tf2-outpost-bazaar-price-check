var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('tf2Prices.db');
db.run('VACUUM');
setInterval(function(){db.run('VACUUM');}, 600000);
process.on('message', function(m){
	prices = JSON.parse(m)['response']['prices'];
	db.serialize(function(){
		for (var id in prices) {
			for (var quality in prices[id]) {
				for (var effect in prices[id][quality]){
					var item;
					if (prices[id][quality][effect]['current']) {
						if (prices[id][quality][effect]['current']['value_high']){
							item = [id, quality, effect, prices[id][quality][effect]['current']['value'], prices[id][quality][effect]['current']['value_high'], prices[id][quality][effect]['current']['currency']];
						} else {
							item = [id, quality, effect, prices[id][quality][effect]['current']['value'], prices[id][quality][effect]['current']['value'], prices[id][quality][effect]['current']['currency']];
						}
						db.run('REPLACE INTO prices values(?,?,?,?,?,?)', item, function(err) {});
					} else {
						process.send(JSON.stringify(prices[id][quality][effect]));
					}
				}
			}
		}
	});
	process.send('ready');
	delete prices;
});

process.on('uncaughtException', function(err) {
	process.send(err);
});