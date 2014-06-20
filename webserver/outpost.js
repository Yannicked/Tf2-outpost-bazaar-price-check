var itemEffect = new RegExp('http://cdn.tf2outpost.com/img/games/440/effects/([0-9]*).png');
var socket = io.connect('http://zebry.nl:2070');   
var pcSend = {};
var PCsettingsCookie = 'Tf2Price';
var PCsettings = getCookie(PCsettingsCookie);
var PCdefaultSettings = {reload:true, reloadTime:1, phishingSensitivity:3, phishing:true};
var $settingsSubtitle = $('<div class="subtitle">Tf2 Outpost pricer</div>');
var $settingsBox = $('<div class="double contents"><label><input type="checkbox" name="refreshChkbox" value="1" onclick="setReload();"><span>Refresh item prices dynamically when browsing page.</span></label><label><span id="refreshMinutesSpan">Refresh prices every:</span><input type="textbox" name="refreshMinutes" class="refreshMinutes"><span> minutes</span></label><div class="clear"></div></div><div class="double contents"> <label> <input type="checkbox" name="phishingChkbox" value="1" onclick="setPhishing();"> <span>Automatically flag phishing links.</span> </label> <label> <span id="phishingSensitivitySpan">Phishing sensitivity:</span> <input type="textbox" name="phishingSensitivity" class="phishingSensitivity"> <span> (3 is default)</span> </label> <div class="clear"> </div> </div>');
var version = '1.8.0';
var changelog = 'Welcome to update 1.8.0 of Tf2 Outpost additions\nChangelog 1.8.0:\n - Added duplication checking';
var dupedCheck = false;
var choise_html = 'none';
var next_page = -1;
var requests = [];
var cached_trades = [];
$.getScript('http://zebry.nl:8020?script=classes_item_index');
$('head').append('<link rel="stylesheet" href="http://zebry.nl:8020/?get=outpostcss" type="text/css" />');
console.debugtf2 = function(msg) {

	console.debug('TF2outpost additions debug: '+msg);

}

if (version != getCookie('version')) {
	alert(changelog);
	setCookie('version', version, 666);
}
$('.solid_bottom.contents.wysiwyg').remove();
$('.notes_edit').click(function() {
	/*setTimeout(function() {*/$('textarea[name="notes"]').parent().parent().parent().prepend('<div class="title" style= "background: #141312; color: #766d68; font-weight: bold; font-size: 10.5pt; border-top: 1px solid #2f2c2a; border-bottom: 1px solid #252220; background: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #1f1d1b), color-stop(100%, #141312)); background: -webkit-linear-gradient(#1f1d1b,#141312); background: -moz-linear-gradient(#1f1d1b,#141312); background: -o-linear-gradient(#1f1d1b,#141312); background: linear-gradient(#1f1d1b,#141312); -webkit-border-radius: 6px 6px 0 0; -moz-border-radius: 6px 6px 0 0; -ms-border-radius: 6px 6px 0 0; -o-border-radius: 6px 6px 0 0; border-radius: 6px 6px 0 0; -webkit-box-shadow: 0 2px 3px rgba(0,0,0,0.1); -moz-box-shadow: 0 2px 3px rgba(0,0,0,0.1); box-shadow: 0 2px 3px rgba(0,0,0,0.1); text-shadow: 0 -1px 0 rgba(0,0,0,0.4);"> <ul class="details"><li class="additions_li_left additions_username" style="padding-right:16px;padding-left:16px"><a href="/user/'+aries.user.id+'" style="display:table-cell; vertical-align: middle;"><strong>'+aries.user.nickname+'</strong> <span class="additions_username_details">wants to say...</span></a></li> </ul><ul class="additions_ul"><li class="additions_li_right"> <a data-tipsy="color" href= "javascript:bb(\'color\',%200,%20\'textarea[name=\\\'notes\\\']\')"> <div class="icon_bcolor"></div></a> </li> <li class="additions_li_right"> <a href= "javascript:bb(\'strike\',%200,%20\'textarea[name=\\\'notes\\\']\')"> <div class="icon_strike"></div> </a></li> <li class="additions_li_right"> <a href= "javascript:bb(\'underline\',%200,%20\'textarea[name=\\\'notes\\\']\')"> <div class="icon_underline"></div> </a></li> <li class="additions_li_right"> <a href= "javascript:bb(\'italic\',%200,%20\'textarea[name=\\\'notes\\\']\')"> <div class="icon_italic"></div> </a></li> <li class="additions_li_right"> <a href= "javascript:bb(\'bold\',%200,%20\'textarea[name=\\\'notes\\\']\')"> <div class="icon_bold"></div> </a></li> </ul> <div class="clear"></div> </div>');
});
//$('textarea[name="notes"]').
$('input[type=\"text\"][name=\"post\"]').each(function(index) {$(this).before('<div class="title" style= "background: #141312; color: #766d68; font-weight: bold; font-size: 10.5pt; border-top: 1px solid #2f2c2a; border-bottom: 1px solid #252220; background: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #1f1d1b), color-stop(100%, #141312)); background: -webkit-linear-gradient(#1f1d1b,#141312); background: -moz-linear-gradient(#1f1d1b,#141312); background: -o-linear-gradient(#1f1d1b,#141312); background: linear-gradient(#1f1d1b,#141312); -webkit-border-radius: 6px 6px 0 0; -moz-border-radius: 6px 6px 0 0; -ms-border-radius: 6px 6px 0 0; -o-border-radius: 6px 6px 0 0; border-radius: 6px 6px 0 0; -webkit-box-shadow: 0 2px 3px rgba(0,0,0,0.1); -moz-box-shadow: 0 2px 3px rgba(0,0,0,0.1); box-shadow: 0 2px 3px rgba(0,0,0,0.1); text-shadow: 0 -1px 0 rgba(0,0,0,0.4);"> <ul class="details"><li class="additions_li_left additions_username"><a href="/user/'+aries.user.id+'" style="display:table-cell; vertical-align: middle;"><strong>'+aries.user.nickname+'</strong> <span class="additions_username_details">wants to say...</span></a></li> </ul><ul class="additions_ul"> <li class="additions_li_right"> <a data-tipsy="color" href= "javascript:bb(\'color\','+index+',%20\'input[type=\\\'text\\\'][name=\\\'post\\\']\')"> <div class="icon_bcolor"></div> </a></li> <li class="additions_li_right"> <a href= "javascript:bb(\'strike\','+index+',%20\'input[type=\\\'text\\\'][name=\\\'post\\\']\')"> <div class="icon_strike"></div> </a></li> <li class="additions_li_right"> <a href= "javascript:bb(\'underline\','+index+',%20\'input[type=\\\'text\\\'][name=\\\'post\\\']\')"> <div class="icon_underline"></div></a> </li> <li class="additions_li_right"> <a href= "javascript:bb(\'italic\','+index+',%20\'input[type=\\\'text\\\'][name=\\\'post\\\']\')"> <div class="icon_italic"></div></a> </li> <li class="additions_li_right"> <a href= "javascript:bb(\'bold\','+index+',%20\'input[type=\\\'text\\\'][name=\\\'post\\\']\')"> <div class="icon_bold"></div> </a></li> </ul> <div class="clear"></div> </div>');});$('.form.container .clear').eq(0).before('<ul class="additions_ul"> <li class="additions_li_right"> <a href="javascript:bb(\'color\',0, \'textarea[name=\\\'post\\\']\')"> <div class="icon_bcolor"></div> </a> </li> <li class="additions_li_right"> <a href="javascript:bb(\'strike\',0, \'textarea[name=\\\'post\\\']\')"> <div class="icon_strike"></div> </a> </li> <li class="additions_li_right"> <a href="javascript:bb(\'underline\',0, \'textarea[name=\\\'post\\\']\')"> <div class="icon_underline"></div> </a> </li> <li class="additions_li_right"> <a href="javascript:bb(\'italic\',0, \'textarea[name=\\\'post\\\']\')"> <div class="icon_italic"></div> </a> </li> <li class="additions_li_right"> <a href="javascript:bb(\'bold\',0, \'textarea[name=\\\'post\\\']\')"> <div class="icon_bold"></div> </a> </li> </ul>');
$('.form.box.module').find('.title').eq(0).before('<ul class="additions_ul"> <li class="additions_li_right"> <a href="javascript:bb(\'color\',0, \'textarea[name=\\\'notes\\\']\')"> <div class="icon_bcolor"></div> </a> </li> <li class="additions_li_right"> <a href="javascript:bb(\'strike\',0, \'textarea[name=\\\'notes\\\']\')"> <div class="icon_strike"></div> </a> </li> <li class="additions_li_right"> <a href="javascript:bb(\'underline\',0, \'textarea[name=\\\'notes\\\']\')"> <div class="icon_underline"></div> </a> </li> <li class="additions_li_right"> <a href="javascript:bb(\'italic\',0, \'textarea[name=\\\'notes\\\']\')"> <div class="icon_italic"></div> </a> </li> <li class="additions_li_right"> <a href="javascript:bb(\'bold\',0, \'textarea[name=\\\'notes\\\']\')"> <div class="icon_bold"></div> </a> </li> </ul>');

socket.on('request', function(request) {
	if (request == 'userInfo') {
		$.get($('li.avatar').find('a').attr('href'), function(data) {
			var username = $(data).find('.nickname.regular').first().text();
			var steamID = $(data).find('.backboard').first().find('a').first().attr('href').substring(6, 23);
			socket.emit('username', JSON.stringify({'username':username, 'steamID':steamID, 'site':'tf2outpost'}));
		});
	}
});

function getParameterByName(name) {
	name = name.replace(/[[]/, "\\[").replace(/[]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


if (window.location.pathname.indexOf('settings') > -1) {
	if (PCsettings === null) {
		setCookie(PCsettingsCookie, PCdefaultSettings, 666);
		PCsettings = PCdefaultSettings;
	}
	$('.submit.contents').last().before($settingsSubtitle).before($settingsBox);
	$(".refreshMinutes").val(PCsettings.reloadTime);
	$("input:checkbox[name='refreshChkbox']").prop('checked', PCsettings.reload);
	$("input:checkbox[name='phishingChkbox']").prop('checked', PCsettings.phishing);
	$(".phishingSensitivity").val(PCsettings.phishingSensitivity);
	$(".refreshMinutes").on('change', function() {
		PCsettings.reloadTime = parseInt($(".refreshMinutes").val());
		setCookie(PCsettingsCookie, PCsettings, 666);
	});
	$(".phishingSensitivity").on('change', function() {
		PCsettings.phishingSensitivity = parseInt($(".phishingSensitivity").val());
		setCookie(PCsettingsCookie, PCsettings, 666);
	});
}

if (PCsettings === null) {
	PCsettings = PCdefaultSettings;
}

function setReload(){
	PCsettings.reload = $("input:checkbox[name='refreshChkbox']").prop('checked');
	setCookie(PCsettingsCookie, PCsettings, 666);
}


function setCookie(c_name,value,exdays) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=JSON.stringify(value) + ((exdays===null) ? "" : "; expires="+exdate.toUTCString());
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
	msg = JSON.parse(msg);
	//console.debugtf2('Got response: "'+msg.price+'" for item with index: '+msg.index);
	var element = $('li[class^="item it_440_"]').eq(msg.index);
  	var toAppend = '';
	if (element.data('attributes')) {
		if (element.attr('data-attributes').indexOf('<br /><span class="label">Backpack.tf: </span>') == -1) {
			toAppend = element.data('attributes');
		} else {
			return;
		}
	} else {
		toAppend = '';
	}
	element.data("attributes", '<br><span class="label">Backpack.tf: </span> '+msg.price+toAppend);
	element.attr("data-attributes", '<br><span class="label">Backpack.tf: </span> '+msg.price+toAppend);

});

var start = new Date().getTime();
function cache_pages() {
	var num = 0
	for (var i = 0; i<20; i++) {
		requests.push($.ajax({
			url: '/recent/'+i,
			success: function(data, status, jqXHR) {
				$(data).find('.trade.box.module').each( function() {
					$(this).data('tradeid')
					var new_trade = true;
					for (var j = 0; j<cached_trades.length; j++) {
						if (cached_trades[j].id == $(this).data('tradeid')) {
							new_trade = false;
						}
					}
					var class_names = ['scout', 'heavy', 'engineer', 'soldier', 'demoman', 'medic', 'pyro', 'spy', 'sniper', 'allclass'];
					classes = ['all'];
					$(this).find('.contents ul').first().find('li').each(function() {
						var item = $(this).attr('data-hash').split(',');
						var itemID  = parseInt(item[1]);
						for (var i=0; i<10; i++) {
							if (classes_item_index[class_names[i]].indexOf(itemID) != -1) {
								if (classes.indexOf(class_names[i]) == -1) {
									classes.push(class_names[i]);
								}
							}
						}
					});
					if (new_trade) {
						cached_trades.push({id: $(this).data('tradeid'), data: this.outerHTML, 'classes': classes});
					}
				});
				num++;
				if (num == 20) {
					requests = [];
					console.debugtf2('Cached 20 pages in: '+(((new Date()).getTime()-start)/1000)+' seconds');
					class_filter_dropdown.disabled=false;
					$('#class_filter').on('change', function() {
						class_filter_dropdown.disabled=true;
						if (choise_html == 'none') {
							choise_html = $('#class_filter').parent().find(".dropdown").children("span").find("div").html();
						}
						$('#class_filter').parent().find(".dropdown").children("span").find("div").html('<div class="icon_loading" id="filter_loading"></div>');
						filterclass($(this).val());
					});
					if (getCookie('class_filter')) {
						/*$('#class_filter').val(getCookie('class_filter'));
						$('#class_filter').parent().find(".dropdown").children("span").find("div").text($('#class_filter option[value="'+getCookie('class_filter')+'"]').text());*/
						if (getCookie('class_filter') != 'all') {
							$('#class_filter').trigger('change');
						}
					}				
				}
			}
		}));

	}
}

function getItemData($item) {
	//console.debugtf2('Collecting items on page');
	$item.each(function(index){
		//console.debugtf2('Scanning item with index: '+index);
		var $this = $('li[class^="item it_440_"]').eq(index);
		var item = $this.attr('data-hash').split(',');
		var itemID  = parseInt(item[1]);
		var itemUniqueID = $this.attr('data-id');
		var itemQuality = parseInt(item[2]);
		var uncraftable = $this.attr('class');
		if (uncraftable.indexOf('uncraftable') > -1) { itemQuality = 600;}
		if (itemID < 90000 && itemID != 5002) {
			var pc = [];
			if (itemQuality == 5) {
				var effect = itemEffect.exec($this.css('background-image'));
				if (effect){
					pc = [itemID, itemQuality, effect[1]];
				} else {
					pc = [itemID, itemQuality, 0];
				}
			} else {
				pc = [itemID, itemQuality, '0'];
			}
			pcSend = {'price':pc, 'index':index};
			//console.debugtf2('Requesting price for item: "'+pc+'" with index: '+index);
			socket.emit('pc', JSON.stringify(pcSend));
			if (dupedCheck) {
				$.ajax({
					url: 'www.backpack.tf/item/'+itemUniqueID,
					success: function(data) {
						var $data = $(data);
						
					},
				});
			}
		}
	});
}

function getSetGo() {
	getItemData($('li[class^="item it_440_"]'));
}
if (window.location.pathname != '/new' && window.location.pathname != '/search') {
	getSetGo();
}

if (window.location.pathname == '/' || window.location.pathname == '/') {
	$('.title').eq(2).prepend('<select class="dropify" id="class_filter" name="class_filter"> <option value="all"> All classes </option> <option value="allclass"> All-class </option> <option value="scout"> Scout </option> <option value="soldier"> Soldier </option> <option value="pyro"> Pyro </option> <option value="demoman"> Demoman </option> <option value="heavy"> Heavy </option> <option value="engineer"> Engineer </option> <option value="medic"> Medic </option> <option value="sniper"> Sniper </option> <option value="spy"> Spy </option> </select>');
	var class_filter_dropdown = new Dropdown($(".dropify"));
	$(".dropify").removeClass("dropify");
	class_filter_dropdown.select({all:0, allclass:1, scout:2, soldier:3, pyro:4, demoman:5, heavy:6, engineer:7, medic:8, sniper:9, spy:10}[getCookie('class_filter')]);
	class_filter_dropdown.disabled=true;
	if (getCookie('class_filter') != 'all') {
		choise_html = $('#class_filter').parent().find(".dropdown").children("span").find("div").html();
		$('#class_filter').parent().find(".dropdown").children("span").find("div").html('<div class="icon_loading" id="filter_loading"></div>');
	}
	cache_pages()
}

$('.dropdown').eq(2).css('border-left', '0')

//$('li.bbcode').attr('style', 'display: inline-block;padding: 3px;margin-right: 10px;border: 1px solid;border-color: black;border-radius:5px;background: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #221f1e), color-stop(100%, #171514)); background: -webkit-linear-gradient(#221f1e,#171514); background: -moz-linear-gradient(#221f1e,#171514); background: -o-linear-gradient(#221f1e,#171514); background: linear-gradient(#221f1e,#171514);');

function bb(type, index, $this) {
	textbox = $($this).eq(index)[0];
	var beforeText = textbox.value.substring(0, textbox.selectionStart);
	var selectedText = textbox.value.substring(textbox.selectionStart, textbox.selectionEnd);
	var afterText = textbox.value.substring(textbox.selectionEnd, textbox.value.length);
	var tagOpen = '';
	var tagClose = '';
	switch (type) {
		case 'bold':
			tagOpen = "[b]";
			tagClose = "[/b]";
			break;
		case 'italic':
			tagOpen = "[i]";
			tagClose = "[/i]";
			break;
		case 'underline':
			tagOpen = "[u]";
			tagClose = "[/u]";
			break;
		case 'strike':
			tagOpen = "[s]";
			tagClose = "[/s]";
			break;
		case 'color':
			tagOpen = "[color=#HEX]";
			tagClose = "[/color]";
			break;
	}
	textbox.value = beforeText+tagOpen+selectedText+tagClose+afterText;
}
// Check if server is up
$.ajax({
	url: 'http://zebry.nl:2070/socket.io/1/',
	success: function() {
		setCookie('serverDownMsg', 'false', 666);
	},
	error: function(xhr) {
		if (getCookie('serverDownMsg') == 'false' && xhr.status !== 0) {
			alert('The pricelist server is down, sorry about that');
		}
		if(xhr.status !== 0){
			setCookie('serverDownMsg', 'true', 666);
		}
	}
});
window.onbeforeunload = function () {
	for ( var i = 0; i<requests.length; i++) {
		requests[i].abort();
	}
	socket.emit('disconnectreason', 'User unloaded page');
	socket.disconnect();
};
// calculate the Levenshtein distance between a and b
var levenshteinenator = function(a, b) {
	var cost;
	var m = a.length;
	var n = b.length;
	if (m < n) {
		var c=a;a=b;b=c;
		var o=m;m=n;n=o;
	}
	var r = [];
	r[0] = [];
	for (var c = 0; c < n+1; c++) {
		r[0][c] = c;
	}
	for (var i = 1; i < m+1; i++) {
		r[i] = [];
		r[i][0] = i;
		for (var j = 1; j < n+1; j++) {
			cost = (a.charAt(i-1) == b.charAt(j-1))? 0: 1;
			r[i][j] = minimator(r[i-1][j]+1,r[i][j-1]+1,r[i-1][j-1]+cost);
		}
	}
	return r[m][n];
};

var minimator = function(x,y,z) {
	if (x < y && x < z) return x;
	if (y < x && y < z) return y;
	return z;
};

function fake(text1, text2) {
	var distance = levenshteinenator(text1, text2);
	return distance>=1 && distance <= PCsettings.phishingSensitivity;
}

var trusted_links = ['steamcommunity.com', 'tf2outpost.com', 'dotaoutpost.com', 'bazaar.tf', 'steampowered.com', 'backpack.tf', 'esoutpost.com'];

function fakeLink(link) {
	if (!(link.split("."))) {
		return false;
	}
	link = /^http:\/\/(www\.|)([^\.]*\.[^\/]*)/.exec(link);
	if (link != undefined) {
		link = link[2];
	} else {
		return false;
	}
	if (trusted_links.indexOf(link) > -1) { return false; }
	for (var i=0; i<trusted_links.length; i++) {
		if (fake(trusted_links[i], link)) {
			return true;
		}
	}
	return false;
}

function scamProtection(){
	$('a').each(function(index) {
		var $this = $('a').eq(index);
		if (isExternal($this.attr('href')) && fakeLink($this.attr('href'))) {
			$this.after($('<span onclick="if (confirm(\'Are you sure you want to follow this link? This link is flagged as a phishing link\')) {location.href = \''+$this.attr('href')+'\';}" class="phishing_url">'+$this.attr('href')+'</span>'));
			$this.remove();
		}
	});
}
function isExternal(url) {
	try {
		var match = url.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
		if (typeof match[1] === "string" && match[1].length > 0 && match[1].toLowerCase() !== location.protocol) return true;
		if (typeof match[2] === "string" && match[2].length > 0 && match[2].replace(new RegExp(":("+{"http:":80,"https:":443}[location.protocol]+")?$"), "") !== location.host) return true;
		return false;
	} catch(err) {
		return false;
	}
}

function setPhishing(){
	PCsettings.phishing = $("input:checkbox[name='phishingChkbox']").prop('checked');
	setCookie(PCsettingsCookie, PCsettings, 666);
}

if (PCsettings.phishingSensitivity) {
	console.debugtf2('Scam protection enabled')
	scamProtection();
} else if (PCsettings.phishingSensitivity === undefined) {
	PCsettings.phishing = true;
	PCsettings.phishingSensitivity = 3;
	setCookie(PCsettingsCookie, PCsettings, 666);

}

function filterclass(class_name){

		$('.trade.box.module').remove();
		onlyClass(class_name);
		setCookie('class_filter', class_name, 666);
}

function makeWorker(script) {
	window.URL = window.URL || window.webkitURL;
	var blob
    	try {
    		blob = new Blob([script], {type: 'application/javascript'});
	} catch (e) { // Backwards-compatibility
    		window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
    		blob = new BlobBuilder();
    		blob.append(script);
    		blob = blob.getBlob();
	}
	return new Worker(URL.createObjectURL(blob));
}

function onlyClass(class_name) {
	var worker = makeWorker('\
		self.addEventListener(\'message\', function(e) { \
			var cached_trades = JSON.parse(e.data).cached_trades;\
			var class_name = JSON.parse(e.data).class_name;\
			var trades = 0; for (var i = 0; i<cached_trades.length; i++) {\
				if (trades == 20) {\
					break;\
				}\
				if (cached_trades[i].classes.indexOf(class_name) != -1) {\
					self.postMessage(cached_trades[i].data); trades++;\
				}\
			}\
			self.postMessage(\'end\');\
		}, false);\
	');
	worker.onmessage = function(event) {
		if (event.data == 'end') {
			worker.terminate();
			getSetGo();
			$('.tipsy.tipsy-n').remove();
			aries.bind("tipsy");
			$('#class_filter').parent().find(".dropdown").children("span").find("div").html(choise_html);
			setCookie('class_filter', class_name, 666);
			class_filter_dropdown.disabled=false;
			choise_html = 'none';
		} else {
  			$('.pagination.box.module').before($(event.data));
		}
  	};
	worker.postMessage(JSON.stringify({'cached_trades': cached_trades, 'class_name':class_name}));
}


function checkDuped(body) {
	console.debugtf2('Checking item for dupes');
	ids = [];
	duped = false;
	$(body).find('.item_summary').each(function() {
		var id = $(this).attr('data-id')
		if (ids.indexOf(id) > -1) {
			duped = true;
		}
		ids.push(id)
	});
	if (duped) {
		console.debugtf2('Found item dupe!');
		body = body.replace('<div class="title">History</div>', '<div class="title">History <span class="phishing_url">This item appears to be duped</span></div>');
	}
	return body.replace('<div class="title">History</div>', '<div class="title">History <a target="_blank" style="float:right;" href="http://backpack.tf/item/'+/<div class\=\"row contents\"><div>Original ID\:<\/div><div class\=\"white\">([0-9]*)<\/div><\/div>/g.exec(body)[1]+'">Backpack.tf history</a></div>');
}
$('.item_summary').off('click').on('click', item_summary_hook);

// Add a hook into aires, Srry for copying your code sneeza
// copy from aires with dupe check inside
function item_summary_hook () {
	var a = $(this),
		c = a.parent(),
		b = $('<div class="loading"><span class="icon_loading"></span></div>'),
		e = new Panel(b, 200),
		f, h = c.data("hash");
		h ? (h = h.split(","), b = c.data("id").toString(), c = h[0], f = h[1], a = h[2]) : (c = a.data("gameid"), b = a.data("id").toString(), f = a.data("index"), a = a.data("quality"));
	aries.api.panel({
		action: "item.summary",
		hash: aries.user.hash,
		gameid: c,
		itemid: b,
		index: f,
		quality: a
	}, function (a) {
		e.set_id("item_summary");
		e.set_html(checkDuped(a.body));
		a.ad && e.set_ad(a.ad)
	}, function (a) {
		e.set_html(a)
	});
	return !1
}

// fixing other peoples work:
document.onerror = function(err) { console.debugtf2('Catched error: '+err) }