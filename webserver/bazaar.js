var socket = io.connect('ws://95.47.140.204:2070');
var steamID = $('.btn.btn-primary.user-btn.hidden-xs').attr('href').replace('/profiles/', '');
var version = '1.5.0.1';
var changelog = 'Welcome to bazaar.tf unusual pricer version '+version+'\nChangelog 1.5.0.1:\n - Fixed server issues';
var PCsettingsCookie = 'Tf2Price'
var PCdefaultSettings = {highestBid:false, preview:false};
var PCsettings = getCookie(PCsettingsCookie);

var previewHTML = '<div id="reply-original-preview" class="replybox form-control trade-comment-reply no-margin" style="overflow: hidden; word-wrap: break-word; resize: horizontal; height:auto; min-height: 54px; width: 944px; margin-top: 10px !important; vertical-align:top"></div>'

console.debugtf2 = function(msg) {

	console.debug('Bazaar.tf additions debug: '+msg);

}

function bbToHtml(input) {
	var bbTypes =  [
		/\[b\](.+)\[\/b\]/ig,
		/\[i\](.+)\[\/i\]/ig,
		/\[u\](.+)\[\/u\]/ig,
		/\[s\](.+)\[\/s\]/ig,
		/\[color\=(#[0-9a-f]{6})\](.+)\[\/color\]/g,
		/\[spoiler\](.+)\[\/spoiler\]/gi,
		/\[img\](.+)\[\/img\]/gi,
		/\[url\=(.+\..+)\](.+)\[\/url\]/gi
	];
	
	var htmlTypes = [
		'<strong>$1</strong>',
		'<em>$1</em>',
		'<span style="text-decoration: underline;">$1</span>',
		'<del>$1</del>',
		'<span style="color:$1;">$2</span>',
		'<span class="spoiler">$1</span>',
		'<img class="comment-image img-responsive" src="$1"></img>',
		'<a href="$1">$2</a>'
	];
	if (input == undefined) {
		return input;
	}
	for (var i=0; i<bbTypes.length; i++) {
		input = input.replace(bbTypes[i], htmlTypes[i]);
	}
	return input;
}
function previewer() {
	input = $('#reply-original');
	input.after($(previewHTML));
	preview = $('#reply-original-preview');
	preview.hide();
	var ival;
	input.focus(function(){
		preview.slideDown({duration: 'slow', queue:false});
		//$('#reply-original-preview').parent().animate({height: 'auto'}, "slow", function() {$('#reply-original-preview').parent().css('height', 'auto');});
		ival = setInterval(function() {
			if (input.val() == '') {
				preview.html('Start typing to see the preview...')
			} else {
				preview.html(bbToHtml(input.val().replace(/\r\n|\r|\n/g,"<br />")));
			}
		}, 10);
	});
	$(document).click(function(e) {
		if( $(e.target).closest("#comments-container").length > 0) {
        		return true;
    		}
		if (preview.is(":hidden")) {
			return true;
		}
	});
}

if (window.location.pathname.indexOf('settings') > -1) {
	if (PCsettings == null) {
		setCookie(PCsettingsCookie, PCdefaultSettings, 666);
		PCsettings = PCdefaultSettings;
	}
	$('.tab-content').append(' <div id="tf2pcbazaar" class="tab-pane fade"> <div class="form-group"> <div class="col-lg-10 col-lg-offset-2" id="tf2pcbazaar-inserter"> <div class="checkbox"><label><input type="checkbox" id="settings-dynamic-auctions" name="dynamic-auctions" value=0> Dynamic Highest-Bids</label></div> <span class="help-block">Dynamically load the highest bid in aucions. (experimental, doesn\'t look that good, working on the looks :P)</span> </div> </div> </div> ');
	$('#tf2pcbazaar-inserter').append('<div class="checkbox"><label><input type="checkbox" id="settings-input-preview" name="input-preview" value=0> Preview comments</label></div> <span class="help-block">Show a preview while typing a comment on a trade</span>');
	$('.nav.nav-pills.nav-stacked').append('<li> <a href="#tf2pcbazaar" data-toggle="tab" data-original-title="" title=""> <i class="fa fa-lightbulb-o"></i> Tf2 PC </a> </li> ');
	$('#settings-dynamic-auctions').prop('checked', PCsettings['highestBid']);
	$('#settings-input-preview').prop('checked', PCsettings['preview']);
}
if (PCsettings) {
	if (PCsettings['highestBid']) {
		getHighestBid();
	}
	if (PCsettings['preview']) {
		previewer();
	}
}

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
		extras = [];//getItemExtras(index);
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
  			$data = $(data).find('.comment.accepted');
			if (data.indexOf('comment accepted')>-1) {
				$icon = $data.find('a').eq(0);
				$name = $data.find('h4');
				$commentContent = $data.find('.comment-content').eq(1);
				$items = $data.find('.comment-offers');
				console.debugtf2($icon.html());
				console.debugtf2($name.html());
				console.debugtf2($commentContent.html());
				console.debugtf2($items.html());
				$('.auction-info').eq(index).parents().eq(3).find('.trade-items').after($('<article class="trade-notes box"></article>').append($name).append($commentContent).append('</br>').append($items));
				getItemData();
			}
		});
		console.debugtf2(link);
	});
}

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

$('#settings-dynamic-auctions').click(function(){
	PCsettings['highestBid'] = $(this).prop('checked');
	setCookie(PCsettingsCookie, PCsettings, 666);
})
$('#settings-input-preview').click(function(){
	PCsettings['preview'] = $(this).prop('checked');
	setCookie(PCsettingsCookie, PCsettings, 666);
})
setTimeout(getItemData, 2500);