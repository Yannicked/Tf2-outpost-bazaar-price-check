var fs = require('fs');
var sqlite3 = require('sqlite3');
var url = require('url');
var request = require('request');

eval(fs.readFileSync('modules/UpdateHandler.js')+'');

setInterval(getPrices, 3600000);
getPrices();

function extraInfo(info){
	process.send(info);
}