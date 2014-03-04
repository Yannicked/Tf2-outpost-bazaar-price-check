// pure prices as of now
var metal = 0.315;
var key = 6.825;
var bud = 19;
// initialize a SQLite database
var db = new sqlite3.Database('tf2Prices.db');
//initialize child loop
var n = cp.fork('modules/updateChild.js');
// request url for bp.tf prices
var options = {
	url: url.parse('http://www.backpack.tf/api/IGetPrices/v3/?format=json&key=52723c734cd7b835768b456a'),
};

var stmt;

function setPure(){
	var keySQL = 'SELECT * FROM prices WHERE id=5021 AND quality=6 AND effect=0';
	var metalSQL = 'SELECT * FROM prices WHERE id=5002 AND quality=6 AND effect=0';
	var budSQL = 'SELECT * FROM prices WHERE id=143 AND quality=6 AND effect=0';
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
			});
		});
	});
}
function getPrices(){
	setPure();
	extraInfo('Loaded price list from disk!');
	request.get(options, function(error, response, body){
		if (response.statusCode == 200) {
			parsePrices(body)
			extraInfo('Downloaded price list!');
		} else if (response.statusCode == 412) {
			extraInfo('Backpack.tf thinks we request too much, loading pricelist from cache');
			setPure();
			extraInfo('Loaded price list from disk!');
		} else {
			extraInfo('Backpack.tf returned status code: '+response.statusCode+' loading pricelist from cache');
			setPure();
			extraInfo('Loaded price list from disk!');
		}
	}).on("error", function(e){
		extraInfo('Got error while requesting pricelist: ' + e.message);
	});
}

function parsePrices(body){
	response = JSON.parse(body)['response'];
	//prices = response['prices'];
	timestamp = parseInt(response['current_time']);
	db.run('CREATE TABLE prices (id integer, quality integer, effect integer, value integer, value_high integer, currency string)', function(err){extraInfo('sqlite: '+err)});
	db.run('DELETE FROM prices', function(err) {extraInfo('sqlite: '+err)});
	db.run('CREATE TABLE timestamp (timestamp integer)', function(err){extraInfo('sqlite: '+err)});
	db.run('DELETE FROM prices', function(err){extraInfo('sqlite: '+err)});
	db.run('REPLACE INTO timestamp values(?)', [timestamp]);
	setTimeout(function(){n.send(body)}, 1000);
	n.on('message', function(m){
		if (m == 'ready') {
			extraInfo('Parsed downloaded prices!');
			setPure();
		} else {
			extraInfo('Caught exception: '+m)
	}
});
}
setPure();