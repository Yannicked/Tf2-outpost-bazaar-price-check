// ==UserScript==
// @name		TF2 Outpost pricer
// @version		1.1
// @description		Show prices of tf2 items on tf2outpost.com
// @author		Yannick
// @include		http://www.tf2outpost.com*
// @include		http://bazaar.tf*
// @run-at document-end
// ==/UserScript==



$.getScript('http://95.47.140.204:8020?script=socketIO', function(data, textStatus, jqxhr){
    console.log(jqxhr.status);
	if (window.location.hostname.indexOf('bazaar.tf')> -1) {
		$.getScript('http://95.47.140.204:8020?script=bazaar',function() {
            
		});
	}else{
		$.getScript('http://95.47.140.204:8020?script=outpost', function(){
		});
	}
});