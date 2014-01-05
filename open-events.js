// ==UserScript==
// @name       Ogame Open Events
// @namespace  
// @version    1
// @description  Open automatically events on overview
// @include      http://*.ogame.*/game/index.php?page=overview*
// @copyright  Eigna
// ==/UserScript==

$(document).ready(function() {
    // open
    $('#js_eventDetailsClosed').trigger('click');
});

