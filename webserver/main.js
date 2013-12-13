var itemEffect = new RegExp('http://cdn.tf2outpost.com/img/games/440/effects/([0-9]*).png');
var items = [];
var price = 'todo';
var socket = io.connect('http://95.47.140.204:2070');   
var elementToSet;
var pcSend = {};
var PCsettingsCookie = 'Tf2Price'
var PCsettings = getCookie(PCsettingsCookie);
var PCdefaultSettings = {'reload':true, 'reloadTime':1};
var $settingsSubtitle = $('<div class="subtitle">Tf2 Outpost pricer</div>');
var $settingsBox = $('<div class="double contents"><label><input type="checkbox" name="refreshChkbox" value="1" onclick="setReload();"><span>Refresh item prices dynamically when browsing page.</span></label><label><span id="refreshMinutesSpan">Refresh prices every:</span><input type="textbox" name="refreshMinutes" class="refreshMinutes"><span> minutes</span></label><div class="clear"></div></div>')
var version = '1.3.2';
var changelog = 'Welcome to update 1.3.2 of Tf2 Outpost pricer\nChangelog 1.3.2:\n - fixed: If you navigated away from the page too fast, the script would say that the server was down\nChangelog 1.3.1:\n - Security changes rolled back because of issues\nChangelog 1.3.0:\n - Security changes (using https)\n - Better preformance under the hood\nChangelog 1.2.1:\n - Bugfixes\nChangelog 1.2.0:\n - Added bbcode buttons!\n - Better performance\n';



if (version != getCookie('version')) {
	alert(changelog);
	setCookie('version', version, 666);
}

$('.notes_edit').click(function() {
  setTimeout(addBB, 100);
});
function addBB() {
	$('#notes_edit_modal').before('<div class="title"><ul><li class="bbcode"><a href="javascript:bb(\'bold\');"><div>Bold</div></a></li><li class="bbcode"><a href="javascript:bb(\'italic\');"><div>Italic</div></a></li><li class="bbcode"><a href="javascript:bb(\'underline\');"><div>Underline</div></a></li><li class="bbcode"><a href="javascript:bb(\'strike\');"><div>Strike</div></a></li><li class="bbcode"><a href="javascript:bb(\'colour\');"><div>Colour</div></a></li></ul><div class="clear"></div></div>');
	$('li.bbcode').attr('style', 'display: inline-block;padding: 3px;margin-right: 10px;border: 1px solid;border-color: black;border-radius:5px;background: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #221f1e), color-stop(100%, #171514)); background: -webkit-linear-gradient(#221f1e,#171514); background: -moz-linear-gradient(#221f1e,#171514); background: -o-linear-gradient(#221f1e,#171514); background: linear-gradient(#221f1e,#171514);');
}

socket.on('request', function(request) {
	if (request == 'userInfo') {
		$.get($('li.avatar').find('a').attr('href'), function(data) {
			username = $(data).find('.nickname.regular').first().text();
			steamID = $(data).find('.backboard').first().find('a').first().attr('href').substring(6, 23);
			socket.emit('username', JSON.stringify({'username':username, 'steamID':steamID, 'site':'tf2outpost'}));
		});
	}
});
jQuery.expr[':'].regex = function(elem, index, match) {
    var matchParams = match[3].split(','),
        validLabels = /^(data|css):/,
        attr = {
            method: matchParams[0].match(validLabels) ? 
                        matchParams[0].split(':')[0] : 'attr',
            property: matchParams.shift().replace(validLabels,'')
        },
        regexFlags = 'ig',
        regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g,''), regexFlags);
    return regex.test(jQuery(elem)[attr.method](attr.property));
}

if (window.location.pathname.indexOf('settings') > -1) {
	if (PCsettings == null) {
		setCookie(PCsettingsCookie, PCdefaultSettings, 666);
		PCsettings = PCdefaultSettings;
	}
	$('.submit.contents').last().before($settingsSubtitle).before($settingsBox);
	$(".refreshMinutes").val(PCsettings['reloadTime']);
	$("input:checkbox[name='refreshChkbox']").prop('checked', PCsettings['reload']);
	$(".refreshMinutes").on('change', function() {
		PCsettings['reloadTime'] = parseInt($(".refreshMinutes").val());
		setCookie(PCsettingsCookie, PCsettings, 666);
	});
}

if (PCsettings == null) {
	PCsettings = PCdefaultSettings;
}

function setReload(){
	PCsettings['reload'] = $("input:checkbox[name='refreshChkbox']").prop('checked');
	setCookie(PCsettingsCookie, PCsettings, 666);
}

function setMin(event){
	if (isNumber(event)){
		return true;
	} else {return false}
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
	/*
	if ($('div[class^="attributes box module"]')[0]){
		console.log('setting bp.tf price');
   		if (!($(".attributes.box.module > .contents > .bptfprice")[0])) {
			$(".attributes.box.module > .contents").append('<div class="row bptfprice"><div>Backpack.tf:</div><div class="white">'+msg['price']+'</div><div class="clear"></div></div>');
		}
	} else {*/
		element = $('li[class^="item it_440_"]').eq(msg['index']);
		if (element.data('attributes')) {
			if (element.data('attributes').indexOf('<br /><span class="label">Backpack.tf: </span>') == -1) {
				toAppend = element.data('attributes');
			} else {
				element.data('attributes', element.data('attributes').replace(/<span class="label">Backpack.tf: <\/span>*<br \/>/,msg['price']+'<br \/>'))
				return
			}
		} else {
			toAppend = ''
		}
    		element.data("attributes", '<br /><span class="label">Backpack.tf: </span> '+msg['price']+toAppend);
	//}
});

function getItemData($item) {
	$item.each(function(index){
		$this = $('li:regex(class, item it_440_[0-9]*)').eq(index);
    		var item = $this.attr('data-hash').split(',');
		var itemID  = parseInt(item[1]);
		var itemQuality = parseInt(item[2]);
		var uncraftable = $this.attr('class');
		if (uncraftable.indexOf('uncraftable') > -1) { var itemQuality = 600;}
       	if (itemID < 90000 && itemID != 5002) {
			if (itemQuality == 5) {
				var effect = itemEffect.exec($this.css('background-image'));
				if (effect){
					var pc = [itemID, itemQuality, effect[1]];
				} else {
					var pc = [itemID, itemQuality, 0];
				}
			} else {
				var pc = [itemID, itemQuality, '0'];
			}
			pcSend = {'price':pc, 'index':index};
			socket.emit('pc', JSON.stringify(pcSend));
		}
	});
}

function getSetGo() {
	getItemData($('li[class^="item it_440_"]'));
}
getSetGo();
if (PCsettings['reload']){
	console.log('dynamic reloading on!');
	setInterval(getSetGo, parseInt(PCsettings['reloadTime'])*60*1000);
} else {
	getSetGo();
}
$('.notes.solid_bottom.contents').before('<div class="title"><ul><li class="bbcode"><a href="javascript:bb(\'bold\');"><div>Bold</div></a></li><li class="bbcode"><a href="javascript:bb(\'italic\');"><div>Italic</div></a></li><li class="bbcode"><a href="javascript:bb(\'underline\');"><div>Underline</div></a></li><li class="bbcode"><a href="javascript:bb(\'strike\');"><div>Strike</div></a></li><li class="bbcode"><a href="javascript:bb(\'colour\');"><div>Colour</div></a></li></ul><div class="clear"></div></div>');
$('li.bbcode').attr('style', 'display: inline-block;padding: 3px;margin-right: 10px;border: 1px solid;border-color: black;border-radius:5px;background: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #221f1e), color-stop(100%, #171514)); background: -webkit-linear-gradient(#221f1e,#171514); background: -moz-linear-gradient(#221f1e,#171514); background: -o-linear-gradient(#221f1e,#171514); background: linear-gradient(#221f1e,#171514);');
function getSelectedText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}
function bb(type) {
	textbox = document.getElementsByName("notes")[0];
	beforeText = textbox.value.substring(0, textbox.selectionStart);
    selectedText = textbox.value.substring(textbox.selectionStart, textbox.selectionEnd);
    afterText = textbox.value.substring(textbox.selectionEnd, textbox.value.length);
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
		case 'colour':
			tagOpen = "[color=#HEX]";
            tagClose = "[/color]";
	}
	document.getElementsByName("notes")[0].value = beforeText+tagOpen+selectedText+tagClose+afterText;
}
// Check if server is up
$.ajax({
    	url: 'http://95.47.140.204:2070/socket.io/1/',
	success: function() {
       	setCookie('serverDownMsg', 'false', 666);
	},
	error: function(xhr, textStatus, errorThrown) {
		if (getCookie('serverDownMsg') == 'false' && xhr.status != 0) {
			alert('The pricelist server is down, sorry about that');
		}
		if(xhr.status != 0){
			setCookie('serverDownMsg', 'true', 666);
		}
	}
});
socket.emit('timestamp', 'yes');
socket.on('timestamp', function(timestamp){
	$('#copyright').find('div').first().append(' Last pricelist update: <strong>'+timestamp+'</strong>');
});

window.onbeforeunload = function (e) {
	socket.emit('disconnectreason', 'User unloaded page');
	socket.disconnect();
};