// ==UserScript==
// @name       Ogame Inactive Message Essential
// @namespace 
// @version    1
// @description  Show only essential informations for inactive planet in probe reporting
// @include    http://*.ogame.*/game/index.php?page=messages*
// @copyright  Eigna
// ==/UserScript==

var $;
try { $ = unsafeWindow.$; }
catch(e) { $ = window.$; }// ==UserScript==
// @name       Ogame Inactive Message Essential
// @namespace 
// @version    1
// @description  Show only essential informations for inactive planet in probe reporting
// @include    http://*.ogame.*/game/index.php?page=messages*
// @copyright  Eigna
// ==/UserScript==

var $;
try { $ = unsafeWindow.$; }
catch(e) { $ = window.$; }

$(document).ready(function() {
    
    $(document).ajaxSuccess(function(e,xhr,settings){    
        if (settings.url.indexOf("page=messages") == -1) return;
        
        $('#mailz tr.entry').each(function() {
            if (!$(this).find('.subject .status_abbr_longinactive, .subject .status_abbr_inactive').length) {
                return true;
            }
            
            var tableReport = $(this).next();
            
            tableReport.find('#showSpyReportsNow .spy').hide();
            tableReport.find("#showSpyReportsNow th:contains('Défense')").parents('.spy').show();
            tableReport.find("#showSpyReportsNow th:contains('Flottes')").parents('.spy').show();
            tableReport.find('#showSpyReportsNow .material').show();
            tableReport.find('#showSpyReportsNow .defenseattack').show();
            
            tableReport.find('#showSpyReportsNow .material th').prepend('<a href="#" class="inactive-msg-view">voir</a> - ');
            
            var total = 0;
            tableReport.find('#showSpyReportsNow .spy2 td:not(.item)').each(function(index) {
                if (index === 3) {
                    return false;
                }
                
                total += parseInt($(this).text().replace (/\D+/gi, ""));
            });

            var color = 'grey';
            if (total / 2 > 6000) {
             	var color = 'red';   
            }
            
            var coord = tableReport.find('#showSpyReportsNow .material th a:not(.inactive-msg-view)').text().substr(1);
            coord = coord.substr(0, coord.length - 1);
            
            tableReport.find('#showSpyReportsNow .material th').prepend(' <span coord="' + coord + '" class="inactive-total" style="color: ' + color + ' !important;">' + total + '</span> - ');
        });
    });
    
    $(document).on('click', '.inactive-msg-view', function(e) {
        e.preventDefault();
        
        $(this).parents('#showSpyReportsNow').find('.spy').show();
    });
});


$(document).ready(function() {
    
    $(document).ajaxSuccess(function(e,xhr,settings){    
        if (settings.url.indexOf("page=messages") == -1) return;
        
        $('#mailz tr.entry').each(function() {
            if (!$(this).find('.subject .status_abbr_longinactive, .subject .status_abbr_inactive').length) {
                return true;
            }
            
            var tableReport = $(this).next();
            
            tableReport.find('#showSpyReportsNow .spy').hide();
            tableReport.find("#showSpyReportsNow th:contains('Défense')").parents('.spy').show();
            tableReport.find("#showSpyReportsNow th:contains('Flottes')").parents('.spy').show();
            tableReport.find('#showSpyReportsNow .material').show();
            tableReport.find('#showSpyReportsNow .defenseattack').show();
            
            tableReport.find('#showSpyReportsNow .material th').prepend('<a href="#" class="inactive-msg-view">voir</a> - ');
            
            var total = 0;
            tableReport.find('#showSpyReportsNow .spy2 td:not(.item)').each(function(index) {
                if (index === 3) {
                    return false;
                }
                
                total += parseInt($(this).text().replace (/\D+/gi, ""));
            });

            var color = 'grey';
            if (total / 2 > 6000) {
             	var color = 'red';   
            }
            
            tableReport.find('#showSpyReportsNow .material th').prepend(' <span style="color: ' + color + ' !important;">' + total + '</span> - ');
        });
    });
    
    $(document).on('click', '.inactive-msg-view', function(e) {
        e.preventDefault();
        
        $(this).parents('#showSpyReportsNow').find('.spy').show();
    });
});
