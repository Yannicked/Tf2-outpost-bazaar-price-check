var socket = io.connect('ws://95.47.140.204:2070');
var steamID = $('.btn.btn-primary.user-btn.hidden-xs').attr('href').replace('/profiles/', '');
var version = '1.3.2';
var changelog = 'Welcome to bazaar.tf unusual pricer version '+version+'\nChangelog 1.3.2:\n - fixed: If you navigated away from the page too fast, the script would say that the server was down\n - Added: this popup';

if (version != getCookie('version')) {
	alert(changelog);
	setCookie('version', version, 666);
}

function setCookie(c_name,value,exdays) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=JSON.stringify(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value+'; path=/';
}

function getCookie(c_name) {
	var c_value = document.cookie;
	var c_start = c_value.indexOf(" " + c_name + "=");
	if (c_start == -1) {
  		c_start = c_value.indexOf(c_name + "=");
  	}
	if (c_start == -1) {
  		c_value = null;
  	} else {
  		c_start = c_value.indexOf("=", c_start) + 1;
  		var c_end = c_value.indexOf(";", c_start);
  		if (c_end == -1) {
			c_end = c_value.length;
		} 
		c_value = JSON.parse(c_value.substring(c_start,c_end));
	}
	return c_value;
}


socket.on('pc', function(msg){
	var msg = JSON.parse(msg);
	//console.log(msg);
	element = $('li.item.q5-440.g440').eq(msg['index']);
	element.attr('i-price', msg['price']);
});
socket.on('request', function(request) {
	if (request == 'userInfo'){
		$.get($('.btn.btn-primary.user-btn.hidden-xs').attr('href'), function(data) {
			username = $(data).find('.rank').eq(0).text();
			toSend = {'username':username, 'steamID':steamID, 'site':'bazaar.tf'};
			//console.log(toSend);
			socket.emit('username', JSON.stringify(toSend));
		});
	}
});

function getItemExtras(index){
	extras = [];
	$item = $('.item.q5-440.g440').eq(index);
	if ($item.attr('i-notes')) {
		if ($item.attr('i-notes').indexOf('Gifted on') > -1) {extras.push({'gifted':true})}
	}
	return extras;
	
}

function getItemData() {
	$item = $('.item.q5-440.g440');
	$item.each(function(index){
		$this = $('.item.q5-440.g440').eq(index)
		var itemID = $this.attr('i-defindex');
		var itemQuality = '5';
		var itemEffect = $this.attr('i-effect');
		extras = getItemExtras(index);
		var pc = [itemID, itemQuality, itemEffect];
		pcSend = {'price':pc, 'index':index, 'extras':extras};
		socket.emit('pc', JSON.stringify(pcSend));
	});
}
getItemData();
/*if (steamID == '76561198065653225') { //trolling a friend
		w = window.open('',"yesWindow", "width=650, height=450");
		w.document.write('<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=5,0,0,0" width="650" height="450" align="top"> <param name="movie" value="youareai.swf"> <param name="quality" value="high"><param name="SCALE" value="exactfit"> <embed src="http://piv.pivpiv.dk/youareai.swf" width="650" height="450" align="top" quality="high" pluginspage="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash" type="application/x-shockwave-flash" scale="exactfit"> </object>');
}*/
$(document).click(function() {
	setTimeout(getItemData, 2000);
});

function getHighestBid() {
	$('.auction-info').each(function(index) {
		link = $('.auction-info').eq(index).parents().eq(3).find('a').attr('href');
		$.get( link , function( data ) {
  			$data = $(data);
			$('.auction-info').eq(index).parents().eq(3).find('.trade-items').append($data.find('.comment.accepted').find('.comment-content').html()+'\n'+$data.find('.comment.accepted').find('.item-list.clearfix').html());
		});
		console.log(link);
	});
}
socket.emit('timestamp', 'yes');
socket.on('timestamp', function(timestamp){
	$('.col-md-4').find('p').first().append(' Last unusual pricelist update: <a href="javascript:alert(\'Last unusual pricelist update: '+timestamp+'\')" style="colour:white">'+timestamp+'</a>');
});

$.ajax({
    	url: 'http://95.47.140.204:2070/socket.io/1/',
	success: function() {
       	setCookie('serverDownMsg', 'false', 666);
	},
	error: function(xhr, textStatus, errorThrown) {
		if (getCookie('serverDownMsg') == 'false' && xhr.status != 0) {
			alert('The unusual pricelist server is down, sorry for that');
		}
		if(xhr.status != 0){
			setCookie('serverDownMsg', 'true', 666);
		}
	}
});

window.onbeforeunload = function (e) {
	socket.emit('disconnectreason', 'User unloaded page');
	socket.disconnect();
};