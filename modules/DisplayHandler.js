var extra = new Array();
var extraIO = new Array();
Array.prototype.removeDuplicates = function (){
  	var temp=new Array();
  	this.sort();
  	for(i=0;i<this.length;i++) {
  		if(this[i]==this[i+1]) {continue}
  		temp[temp.length]=this[i];
  	}
	return temp;
}

function update() {
	process.stdout.write('\033[?25l');
	process.stdout.write('\u001B[2J\u001B[0;0f');
	process.stdout.write(pricelistLOG);
	process.stdout.write('Clients:');
	process.stdout.write('\nip\t\t\tusername\t\tsteam ID\t    current site')
	var clientLOG = '';
	clientsNow = clients.removeDuplicates()
	for (var i = 0; i < clientsNow.length; i++) {
		if (usernames[clientsNow[i]]) {
			if (usernames[clientsNow[i]].length > 20) {
				usernames[clientsNow[i]] = usernames[clientsNow[i]].substring(0, 20)+'..';
			}
			clientLOG = clientLOG+'\n\033[s'+clientsNow[i]+'\t\t'+usernames[clientsNow[i]]+'\033[u\033[48C'+steamIDs[clientsNow[i]]+'   '+sites[clientsNow[i]];
		} else {
			clientLOG = clientLOG+'\n'+clientsNow[i];
		}
	}
	process.stdout.write(clientLOG);
	process.stdout.write('\nExtra info:');
	for (var i=0; i<extra.removeDuplicates().length; i++) {
		process.stdout.write('\n'+extra.removeDuplicates()[i]);
	}
	process.stdout.write('\033[5ESocket.io:');
	for (var i=0; i<extraIO.removeDuplicates().length; i++) {
		process.stdout.write('\n'+extraIO.removeDuplicates()[i]);
	}

}

function extraInfo(text){
	extra.push(text);
	setTimeout(function() {var index = extra.indexOf(text); extra.splice(index, 1);}, 5000);
}

var loggerInterval = setInterval(update, 2500);

var colors = [
    31
  , 33
  , 36
  , 90
];

var levels = [
    'error'
  , 'warn'
  , 'info'
  , 'debug'
];
var extraInfoIO = module.exports = function (opts) {
  opts = opts || {}
  this.colors = false !== opts.colors;
  this.level = 2;
  this.enabled = true;
};

function extraInfoIOLog (text){
	extraIO.push(text);
	setTimeout(function() {var index = extraIO.indexOf(text); extraIO.splice(index, 1);}, 2500);
};

extraInfoIO.pad = function (str) {
  var max = 0;

  for (var i = 0, l = levels.length; i < l; i++)
    max = Math.max(max, levels[i].length);

  if (str.length < max)
    return str + new Array(max - str.length + 1).join(' ');

  return str;
};


extraInfoIO.error = function (type,msg) {
	var index = levels.indexOf(type);
	extraInfoIOLog('\033['+colors[index]+'m'+extraInfoIO.pad('error')+' - \033[39m'+msg);
}
/*levels.forEach(function (name) {
  	extraInfoIO.prototype[name] = function () {
    		var index = levels.indexOf(name);
		extraInfoIOLog('\033['+colors[index]+'m'+extraInfoIO.pad(type)+' - \033[39m'+msg);  
	};
});*/
extraInfoIO.warn = function (msg) {
	var index = 1;
	extraInfoIOLog('\033['+colors[index]+'m'+extraInfoIO.pad('warn')+' - \033[39m'+msg);
}
extraInfoIO.info = function (msg) {
	var index = 2;
	if (msg == 'transport end (booted)') {
		return;
	} else if (msg == 'transport end by forced client disconnection') {
		return;
	} else {
		extraInfoIOLog('\033['+colors[index]+'m'+extraInfoIO.pad('info')+' - \033[39m'+msg);
	}
}
extraInfoIO.debug = function (msg) {
	var index = 3;
	//extraInfo('\033['+colors[index]+'m'+pad('debug')+' - \033[39m'+msg);
}