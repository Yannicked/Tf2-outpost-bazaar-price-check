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
				if (isNaN(price_high) || priceToString(price, 2) == priceToString(price_high, 2)){
					price = priceToString(price, 1)+' Earbuds';
				} else {
					price = priceToString(price, 1)+' - '+priceToString(price_high, 1)+' Earbuds';
				}
			} else {
				if (isNaN(price_high) || priceToString(price, 2) == priceToString(price_high, 2)){
					price = priceToString(price, 2)+' Keys';
				} else {
					price = priceToString(price, 2)+' - '+priceToString(price_high, 2)+' Keys';
				}
			}
		} else {
			if (isNaN(price_high) || priceToString(price, 2) == priceToString(price_high, 2)){
				price = priceToString(price, 2)+' Refined';
			} else {
				price = priceToString(price, 2)+' - '+priceToString(price_high, 2)+' Refined';
			}
		}
	} else if (currency == 'earbuds') {
		if (isNaN(price_high) || priceToString(price, 2) == priceToString(price_high, 2)){
			price = priceToString(price, 1)+' Earbuds';
		} else {
			price = priceToString(price, 1)+' - '+priceToString(price_high, 1)+' Earbuds';
		}
	} else if (currency == 'metal') {
		if (price>key) {
			price = price/key;
			price_high = price_high/key;
			if (price>bud) {
				price = price/bud;
				price_high = price_high/bud;
				if (isNaN(price_high) || priceToString(price, 2) == priceToString(price_high, 2)){
					price = priceToString(price, 1)+' Earbuds';
				} else {
					price = priceToString(price, 1)+' - '+priceToString(price_high, 1)+' Earbuds';
				}
			} else {
				if (isNaN(price_high) || priceToString(price, 2) == priceToString(price_high, 2)){
					price = priceToString(price, 2)+' Keys';
				} else {
					price = priceToString(price, 2)+' - '+priceToString(price_high, 2)+' Keys';
				}			}
		} else {
			if (isNaN(price_high) || priceToString(price, 2) == priceToString(price_high, 2)){
				price = priceToString(price, 2)+' Refined';
			} else {
				price = priceToString(price, 2)+' - '+priceToString(price_high, 2)+' Refined';
			}
		}

	} else if (currency == 'keys') {
		if (price>bud) {
			price = price/bud;
			price_high = price_high/bud;
			if (isNaN(price_high) || priceToString(price, 2) == priceToString(price_high, 2)){
				price = priceToString(price, 1)+' Earbuds';
			} else {
				price = priceToString(price, 1)+' - '+priceToString(price_high, 1)+' Earbuds';
			}
		} else {
			if (isNaN(price_high) || priceToString(price, 2) == priceToString(price_high, 2)){
				price = priceToString(price, 2)+' Keys';
			} else {
				price = priceToString(price, 2)+' - '+priceToString(price_high, 2)+' Keys';
			}
		}
	}
	return (price);
}

function pcTimestamp(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp);
    var fin_hour = String(a.getHours())
    if (fin_hour.length == 1) {
        fin_hour = '0' + fin_hour;
    }
    var fin_minutes = String(a.getMinutes())
    if (fin_minutes.length == 1) {
        fin_minutes = '0' + fin_minutes;
    }
    var time = fin_hour + ':' + fin_minutes;
    return time;
}

function sendTimestamp(socket){
	var sqlQueryString = 'SELECT * FROM timestamp';
	db.get(sqlQueryString, function(err, row) {
		socket.emit('timestamp', pcTimestamp(row['timestamp']));
	});
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
function priceToString(price, fixed) {
	price = price.toFixed(fixed).toString();
	priceFloat = parseFloat(price);
	if (price.substring(price.length-3, price.length) == '.00') {
		price = price.substring(0, price.length-3);
	} else if (price.substring(price.length-2, price.length) == '.0') {
		price = price.substring(0, price.length-2);
	} else if (price.split('.')[1]){
		if ((price.split('.')[1].length > 1) && (price.length > 4)) {
			price = price.substring(0, price.length-1);
		}
	}
	if (price.substring(price.length-1, price.length) == '.') {
		price = price.substring(0, price.length-1);
	}
	return price;
}
