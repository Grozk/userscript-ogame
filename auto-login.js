// ==UserScript==
// @name           	Ogame AutoLogin
// @namespace      	
// @description    	LidOAN : Ogame Alert Notifier
// @author         	Eigna
// @version         1
// @include			http://*.ogame.*/*
// @copyright		Eigna
// ==/UserScript==

$(document).ready(function() {
    // autologin with reminder
    setInterval(function() {
        if($('#loginSubmit').length) {
            $('#loginSubmit').trigger('click');   
        }
    }, 20000);    
});

