var extra = new Array();

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
	process.stdout.write('\u001B[2J\u001B[0;0f');
	process.stdout.write(pricelistLOG);
	process.stdout.write('Clients:');
	process.stdout.write('\nip\t\t\tusername\t\tsteam ID')
	var clientLOG = '';
	clientsNow = clients.removeDuplicates()
	for (var i = 0; i < clientsNow.length; i++) {
		if (usernames[clientsNow[i]]) {
			clientLOG = clientLOG+'\n'+clientsNow[i]+'\t\t'+usernames[clientsNow[i]].replace(/(\r\n|\n|\r)/gm," ")+'\t'+steamIDs[clientsNow[i]];
		} else {
			clientLOG = clientLOG+'\n'+clientsNow[i];
		}
	}
	process.stdout.write(clientLOG);
	for (var i=0; i<extra.removeDuplicates().length; i++) {
		process.stdout.write('\n'+extra.removeDuplicates()[i]);
	}
}

function extraInfo(text){
	extra.push(text);
	setTimeout(function() {var index = extra.indexOf(text); extra.splice(index, 1);}, 5000);
}