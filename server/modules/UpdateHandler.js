// pure prices as of now
var metal = 0.315;
var key = 6.125;
var bud = 16;
// initialize a SQLite database
var db = new sqlite3.Database('tf2Prices.db');
// request url for bp.tf prices
var options = {
	url: url.parse('http://www.backpack.tf/api/IGetPrices/v3/?format=json&key=52723c734cd7b835768b456a'),
};


function setPure(){
	var keySQL = 'SELECT * FROM "5021" WHERE quality=6 AND effect=0';
	var metalSQL = 'SELECT * FROM "5002" WHERE quality=6 AND effect=0';
	var budSQL = 'SELECT * FROM "143" WHERE quality=6 AND effect=0';
	db.get(keySQL, function(err, row) {
		if (row) {
			if(row['value_high']){
				key = (parseFloat(row['value'])+parseFloat(row['value_high']))/2;
			} else {
				key = parseFloat(row['value']);
			}
		}
		db.get(metalSQL, function(err, row) {
			if (row) {
				if(row['value_high']){
					metal = (parseFloat(row['value'])+parseFloat(row['value_high']))/2;
				} else {
					metal = parseFloat(row['value']);
				}
			}
			db.get(budSQL, function(err, row) {
				if (row) {
					if(row['value_high']){
						bud = (parseFloat(row['value'])+parseFloat(row['value_high']))/2;
					} else {
						bud = parseFloat(row['value']);
					}
				}
				pricelistLOG = 'Current pricelist includes:\nRefined: '+metal+' usd\nKey: '+key+' Refined\nEarbuds: '+bud+' Keys\n';
				extraInfo('Downloaded price list!');
			});
		});
	});
}
function getPrices(){
	request.get(options, function(error, response, body){
		if (response.statusCode == 200) {
			parsePrices(body)
		} else if (response.statusCode == 412) {
			extraInfo('Backpack.tf thinks we request too much, loading pricelist from memory');
			setPure();
		} else {
			extraInfo('backpack.tf returned status code: '+response.statusCode+' loading pricelist from memory');
			setPure();
		}
	}).on("error", function(e){
		extraInfo('Got error while requesting pricelist: ' + e.message);
	});
}

function parsePrices(body){
	response = JSON.parse(body)['response'];
	prices = response['prices'];
	db.serialize(function() {
		for (var id in prices) {
			db.run('DROP TABLE IF EXISTS "'+id+'"');
			db.run('CREATE TABLE "'+id+'" (quality integer, effect integer, value integer, value_high integer, currency string)');
			var stmt = db.prepare('INSERT OR REPLACE INTO "'+id+'" values(?, ?, ?, ?, ?)');
			for (var quality in prices[id]) {
				for (var effect in prices[id][quality]){
					var item;
					if (prices[id][quality][effect]['current']['value_high']){
						item = {'quality':quality, 'effect':effect, 'value':prices[id][quality][effect]['current']['value'], 'value_high':prices[id][quality][effect]['current']['value_high'], 'currency':prices[id][quality][effect]['current']['currency']};
  					} else {
						item = {'quality':quality, 'effect':effect, 'value':prices[id][quality][effect]['current']['value'], 'value_high':prices[id][quality][effect]['current']['value'], 'currency':prices[id][quality][effect]['current']['currency']};
					}
					stmt.run([item['quality'],item['effect'],item['value'],item['value_high'],item['currency']]);
				}
			}
			stmt.finalize();
		}
		delete prices;
		setPure();
	});
}
