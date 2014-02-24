// ==UserScript==
// @name           	Ogame Activity Checker
// @namespace      	
// @description    	Ogame Activity Checker
// @author         	Eigna
// @version         1
// @include			http://*.ogame.*/*
// @copyright		Eigna
// ==/UserScript==

var activityActive = true;
var activityPlanets = [
    '2:260:11',
    '2:324:6'
];
var activityInterlval = null;
var current;
var coordonates;

$(document).ready(function() {
    if (activityActive
       && document.location.href == 'http://s124-fr.ogame.gameforge.com/game/index.php?page=galaxy') {
        setTimeout(function() {
    		activityProcess();
        }, activityRand(5 * 1000, 12 * 1000));
    }
    
    activityInterlval = setInterval(function() {
        if (!activityActive) {
            clearInterval(activityInterlval);
            return false;
        }
        
        if (document.location.href != 'http://s124-fr.ogame.gameforge.com/game/index.php?page=galaxy') {
            document.location.href = 'http://s124-fr.ogame.gameforge.com/game/index.php?page=galaxy';
        }
        
        activityProcess();
        
    }, activityRand(9 * 60 * 1000, 17 * 60 * 1000));    
});

function changeSystemTo(galaxy, system)
{
    $('#galaxy_input').val(galaxy);
    $('#system_input').val(system);
    
    canLoadContentSync(galaxy, system)
}

function activityProcess()
{    
    $.each(activityPlanets, function(index, value) {
        //setTimeout(function(value) {
            coordonates = value.split(':');
           
            changeSystemTo(coordonates[0], coordonates[1]);
        
                $.ajax({
                    async: false,
                    type: 'GET',
                    url: 'http://ogame.mtxserv.fr/coordonates.php'
                });
            
            if(!$('td[rel="planet' + coordonates[2] + '"]').length) {
                return true;   
            }
            
            var hasActivity = false;
            
            if ($('td[rel="planet' + coordonates[2] + '"] .activity').length
               && !$('td[rel="planet' + coordonates[2] + '"] .showMinutes').length) {
                hasActivity = true;   
            }
            
            if (hasActivity) {
                $.ajax({
                    async: false,
                    dataType: 'jsonp',
                    type: 'POST',
                    url: 'http://ogame.mtxserv.fr/coordonates.php',
                    data: 'coordonates=' + value
                });
            }
            
            // Moon        
            if(!$('td[rel="moon' + coordonates[2] + '"]').length) {
                return true;   
            }
            
            var hasActivity = false;
            
            if ($('td[rel="moon' + coordonates[2] + '"] .activity').length
               && !$('td[rel="moon' + coordonates[2] + '"] .showMinutes').length) {
                hasActivity = true;   
            }
            
            if (hasActivity) {
                $.ajax({
                    async: false,
                    dataType: 'jsonp',
                    type: 'POST',
                    url: 'http://ogame.mtxserv.fr/coordonates.php',
                    data: 'coordonates=' + value + 'L'
                });
            }
//        }(value), activityRand(10 * 1000, 26 * 1000));
        
        return true;
    });
}

function activityRand(timeMin, timeMax)
{
	return (parseInt(timeMin) + Math.round(Math.random() * (timeMax - timeMin)));
}


function submitFormSync() {
    galaxy = $("#galaxy_input").val();
    system = $("#system_input").val();
    
    canLoadContentSync(galaxy, system);
}

function canLoadContentSync(b, a) {
    $("#galaxyLoading").show();
    
    $.ajax({
        url: canLoadContentLink,
        data:  {
            galaxy: b,
            system: a
        },
        async: false,
        success: doLoadSync,
        type: 'POST'
    });
}


function loadContentSync(b, a) {
    $.ajax({
        url: contentLink,
        type: 'POST',
        async: false,
        success: displayContentGalaxy,
        data: {
            galaxy: b,
            system: a
        }
    });
    
    getAjaxResourcebox();
}

function doLoadSync(a) {
    var a = $.parseJSON(a);
    if (a.status) {
        $("#galaxy_input").val(a.galaxy);
        $("#system_input").val(a.system);
        removeTooltip($("#galaxytable tbody *"));
        $.each(buildListCountdowns, function () {
            timerHandler.removeCallback(this.timer)
        });
        loadContentSync(a.galaxy, a.system)
    } else {
        $("#galaxyLoading").hide();
        errorBoxDeuterium()
    }
}

