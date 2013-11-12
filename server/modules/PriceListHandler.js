function calculatePrice(price, price_high, currency) {
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
					price = priceToString(price)+' Earbuds';
				} else {
					price = priceToString(price)+' - '+priceToString(price_high)+' Earbuds';
				}
			} else {
				if (isNaN(price_high)){
					price = priceToString(price)+' Keys';
				} else {
					price = priceToString(price)+' - '+priceToString(price_high)+' Keys';
				}
			}
		} else {
			if (isNaN(price_high)){
				price = priceToString(price)+' Refined';
			} else {
				price = priceToString(price)+' - '+priceToString(price_high)+' Refined';
			}
		}
	} else if (currency == 'earbuds') {
		if (isNaN(price_high)){
			price = priceToString(price)+' Earbuds';
		} else {
			price = priceToString(price)+' - '+priceToString(price_high)+' Earbuds';
		}
	} else if (currency == 'metal') {
		if (price>key) {
			price = price/key;
			price_high = price_high/key;
			if (price>bud) {
				price = price/bud;
				price_high = price_high/bud;
				if (isNaN(price_high)){
					price = priceToString(price)+' Earbuds';
				} else {
					price = priceToString(price)+' - '+priceToString(price_high)+' Earbuds';
				}
			} else {
				if (isNaN(price_high)){
					price = priceToString(price)+' Keys';
				} else {
					price = priceToString(price)+' - '+priceToString(price_high)+' Keys';
				}			}
		} else {
			if (isNaN(price_high)){
				price = priceToString(price)+' Refined';
			} else {
				price = priceToString(price)+' - '+priceToString(price_high)+' Refined';
			}
		}

	} else if (currency == 'keys') {
		if (price>bud) {
			price = price/bud;
			price_high = price_high/bud;
			if (isNaN(price_high)){
				price = priceToString(price)+' Earbuds';
			} else {
				price = priceToString(price)+' - '+priceToString(price_high)+' Earbuds';
			}
		} else {
			if (isNaN(price_high)){
				price = priceToString(price)+' Keys';
			} else {
				price = priceToString(price)+' - '+priceToString(price_high)+' Keys';
			}
		}
	}
	return (price);
}
function sendPrice(socket, sqlQueryString, index, item ) {
	if (item['extras']) {
			extras = item['extras']
	}
	db.get(sqlQueryString, function(err, row) {
		if (err || ! row) {
			 socket.emit('pc', JSON.stringify({'price':'n/a','index':index})); 
		} else {
			price = parseFloat(row['value']);
			price_high = parseFloat(row['value_high']);
			currency = row['currency'];
			priceToSend = calculatePrice(price,price_high,currency);
			if (item['extras']) {
				for (var i = 0; i < extras.length; i++) {
    					if (extras[i]['gifted']){price = price*0.75; price_high = price_high*0.75;}
					priceToSend = priceToSend+' ('+calculatePrice(price,price_high,currency)+' with bonuses)';
				}
			}
			socket.emit('pc', JSON.stringify({'price':priceToSend,'index':index}));
		}
	});
}
function priceToString(price) {
	price = price.toFixed(1).toString();
	if (price.substring(price.length-2, price.length) == '.0') {
		return price.substring(0, price.length-2);
	} else {
		return price
	}
}
