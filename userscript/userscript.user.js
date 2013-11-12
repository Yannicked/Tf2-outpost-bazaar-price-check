// ==UserScript==
// @name		TF2 Outpost pricer
// @version		1.1
// @description		Show prices of tf2 items on tf2outpost.com
// @author		Yannick
// @include		http://www.tf2outpost.com*
// @include		http://bazaar.tf*
// @run-at document-end
// ==/UserScript==



$.getScript('http://95.47.140.204/tf2/pc/socket.io.js', function(){
	if (window.location.hostname.indexOf('bazaar.tf')> -1) {
		$.getScript('http://95.47.140.204/tf2/pc/bazaar.js',function() {
            
		});
	}else{
		$.getScript('http://95.47.140.204/tf2/pc/main.js', function(){
		});
	}
});