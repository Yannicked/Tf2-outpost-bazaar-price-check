var http = require("http");
var url = require('url');

http.createServer(function(request,response){
	var url_parts = url.parse(request.url, true);
	var query = url_parts.query;
	if (query['effect'] && query['quality'] && query['id']) {
		db.get('SELECT * FROM "'+query['id']+'" WHERE quality='+query['quality']+' AND effect='+query['effect'], function(err, row) {
			if (err || ! row) {
				response.writeHeader(501, {"Content-Type": "text/plain"});
				response.write('ITEM NOT FOUND');
			} else {
				response.writeHeader(200, {"Content-Type": "text/plain"});
				price = parseFloat(row['value']);
				price_high = parseFloat(row['value_high']);
				currency = row['currency'];
				priceToSend = JSON.stringify(calculatePriceJSON(price,price_high,currency));
				response.write(priceToSend);
			}
			response.end();
		});
	} else {
		response.writeHeader(418, {"Content-Type": "text/plain"});
		response.write('I\'m a teapot');
		response.end();
	}
}).listen(8080);

function calculatePriceJSON(price, priceHigh, currency) {
	if (currency == 'usd') {
		price = price/metal;
		price_high = price_high/metal;
		if (price>key) {
			price = price/key;
			price_high = price_high/key;
			if (price>bud) {
				price = price/bud;
				price_high = price_high/bud;
				if (isNaN(price_high)){
					price = {'value':priceToString(price), 'currency':'earbuds'};
				} else {
					price = {'value':priceToString(price), 'value_high':priceToString(price_high), 'currency':'earbuds'};

				}
			} else {
				if (isNaN(price_high)){
					price = {'value':priceToString(price), 'currency':'keys'};
				} else {
					price = {'value':priceToString(price), 'value_high':priceToString(price_high), 'currency':'keys'};
				}
			}
		} else {
			if (isNaN(price_high)){
				price = {'value':priceToString(price), 'currency':'refined'};
			} else {
				price = {'value':priceToString(price), 'value_high':priceToString(price_high), 'currency':'refined'};
			}
		}
	} else if (currency == 'earbuds') {
		if (isNaN(price_high)){
			price = {'value':priceToString(price), 'currency':'earbuds'};
		} else {
			price = {'value':priceToString(price), 'value_high':priceToString(price_high), 'currency':'earbuds'};
		}
	} else if (currency == 'metal') {
		if (price>key) {
			price = price/key;
			price_high = price_high/key;
			if (price>bud) {
				price = price/bud;
				price_high = price_high/bud;
				if (isNaN(price_high)){
					price = {'value':priceToString(price), 'currency':'earbuds'};
				} else {
					price = {'value':priceToString(price), 'value_high':priceToString(price_high), 'currency':'earbuds'};
				}
			} else {
				if (isNaN(price_high)){
					price = {'value':priceToString(price), 'currency':'keys'};
				} else {
					price = {'value':priceToString(price), 'value_high':priceToString(price_high), 'currency':'keys'};
				}			
			}
		} else {
			if (isNaN(price_high)){
				price = {'value':priceToString(price), 'currency':'refined'};
			} else {
				price = {'value':priceToString(price), 'value_high':priceToString(price_high), 'currency':'refined'};
			}
		}

	} else if (currency == 'keys') {
		if (price>bud) {
			price = price/bud;
			price_high = price_high/bud;
			if (isNaN(price_high)){
				price = {'value':priceToString(price), 'currency':'earbuds'};
			} else {
				price = {'value':priceToString(price), 'value_high':priceToString(price_high), 'currency':'earbuds'};
			}
		} else {
			if (isNaN(price_high)){
				price = {'value':priceToString(price), 'currency':'keys'};
			} else {
				price = {'value':priceToString(price), 'value_high':priceToString(price_high), 'currency':'keys'};
			}
		}
	}
	return (price);
}
