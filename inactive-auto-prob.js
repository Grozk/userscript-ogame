// ==UserScript==
// @name       Ogame Inactive AutoProb
// @namespace 
// @version    1
// @description  Send automatically your probes in the galaxy :)
// @include    http://*.ogame.*/game/index.php?page=galaxy*
// @copyright  Eigna
// ==/UserScript==

var $;
try { $ = unsafeWindow.$; }
catch(e) { $ = window.$; }

var inactiveStatus = false;
var inactivePeriodRange = 20;
var inactiveNbSonde = 1;

var planets = [];
var nbScanned = 0;
var current;
var intervalInactiv;

$(document).ready(function() {
    initUi();
    
    $(document).on('click', '#inactive-start', function() {
        if (getNumberOfProbeAvailable()) {
            inactiveStatus = true;
	        setInactiveStatus();
        } else {
         	alert('Aucune sonde disponible');   
        }
    });
    
    $(document).on('click', '#inactive-stop', function() {
        inactiveStatus = false;
        setInactiveStatus();
    });
});

function getNumberOfProbeAvailable()
{
    return parseInt($('#probeValue').text());
}

function hasSlotFree()
{
    return getSlotsUsed() < getSlotsTotal();
}

function getSlotsTotal()
{
    var slots = $('#slotValue').text();
    var pos = slots.indexOf('/');
    
    return parseInt(slots.substring(pos + 1));   
}

function getSlotsUsed()
{
    return parseInt($('#slotUsed').text());
}

function setInactiveStatus()
{
    if (inactiveStatus) {
        $('#inactive-start').text('Stop').attr('id', 'inactive-stop');
        
        scanInactive();
    } else {
        $('#inactive-stop').text('Start').attr('id', 'inactive-start');
    }
}

function changeSystemTo(system)
{
    current =  system;
    $('#system_input').val(system);
    submitFormSync();
	
    planets = getInactivePlanets();
    
    scanInactiveInSystem();
}

function scanInactive()
{
    var from = parseInt($('#inactive-period-from').val());
    var to   = parseInt($('#inactive-period-to').val());
                    
    changeSystemTo(from);
    createIntervalInactiv();
}

function createIntervalInactiv()
{   
    intervalInactiv = setInterval(function() {
        if (nbScanned == planets.length) {
         	console.log('toutes les planetes du systeme ont été scannés');
            
            clearInterval(intervalInactiv);
            nbScanned = 0;
            
            if (current < parseInt($('#inactive-period-to').val())) {
             	console.log('il reste encore des systemes');
                changeSystemTo(current+1);
                createIntervalInactiv();
            }
        }
    }, inactiveRand(1046, 3434));
}

function inactiveRand(timeMin, timeMax)
{
	return (parseInt(timeMin) + Math.round(Math.random() * (timeMax - timeMin)));
}

function scanInactiveInSystem()
{    
    nbScanned = 0;
    
    $.each(planets, function(index, value) {
        inactiveSendProbe(index, value, inactiveRand(1345, 2414), false);
    });
}

function inactiveSendProbeRefresh(index, value, base)
{
    inactiveSendProbe(0, value, base, true);
}

function inactiveSendProbe(index, value, base, refresh)
{
    setTimeout(function() {
                if (refresh) {
                    submitFormSync();
                }
        
                var scanned = false;
                    
                while (!scanned) {
                    if (hasSlotFree() && getNumberOfProbeAvailable()) {
                        var split = value.split(':');
                        var planetNumber = parseInt(split[2]);
                        
                        console.log('send to ' + value);
                        
                        sendShipsSync(6, $('#galaxy_input').val(), $('#system_input').val(), planetNumber, 1, 3);
                        
                        if ($('#fleetstatusrow .error').length) {
                            console.log('wait error detected');
                        	inactiveSendProbeRefresh(index, value, inactiveRand(1241, 1872));
                            scanned = true;
                        } else {
                            scanned = true;  
                            nbScanned++;
                        }
                    } else if(!getNumberOfProbeAvailable()) {
                        console.log('aucune sonde disponible');
                        inactiveSendProbeRefresh(index, value, inactiveRand(135845, 146512));
                            scanned = true;  
                    } else {
                        console.log('full slot, wait 140s');
                        inactiveSendProbeRefresh(index, value, inactiveRand(135845, 146512));
                            scanned = true;  
                    }
                }
            }, base * (index+1) );
}

function getInactivePlanets()
{
    var planets = new Array();
    
    var system = parseInt($('#system_input').val());
    var galaxy = parseInt($('#galaxy_input').val());
    
    $('#galaxytable .inactive, #galaxytable .longinactive').each(function() {
        if (!$(this).hasClass('vacation')) {
        	planets.push(galaxy + ':' + system + ':' + $(this).parents('tr').find('.position').text());
        }
    });
    
    return planets;
}

function initUi() {
    $('#galaxyContent').before('<div style="margin: 5px;">'
                                                + 'Scan inactive: '
                                                + '<input id="inactive-period-from" class="hideNumberSpin" maxlength="3" type="text" pattern="[0-9]*" size="1">'
                                                + ' to <input id="inactive-period-to" class="hideNumberSpin" maxlength="3" type="text" pattern="[0-9]*" size="1">'
                                           		+ '<button id="inactive-start">Start</button>'
                                                + '</div>');
    
    // set default value
    var system = parseInt($('#system_input').val());
    $('#inactive-period-from').val(system - inactivePeriodRange);
    $('#inactive-period-to').val(system + inactivePeriodRange);
}

// SYSTEM Sync methods
function sendShipsSync(a, f, e, b, c, d) {
    if (shipsendingDone == 1) {
        shipsendingDone = 0;
        params = {
            mission: a,
            galaxy: f,
            system: e,
            position: b,
            type: c,
            shipCount: d,
            token: miniFleetToken
        };
        $.ajax(miniFleetLink, {
            data: params,
            dataType: "json",
            type: "POST",
            async: false,
            success: function (g) {
                if (typeof (g.newToken) != "undefined") {
                    miniFleetToken = g.newToken
                }
                displayMiniFleetMessage(g.response)
            }
        })
    }
}

function submitFormSync() {
    galaxy = $("#galaxy_input").val();
    system = $("#system_input").val();
    
    canLoadContentSync(galaxy, system)
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

