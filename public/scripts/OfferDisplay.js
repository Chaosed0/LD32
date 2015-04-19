
define(['jquery', './Util', './Constants'], function($, u, c) {

    var OfferDisplay = {}

    $('#offer_wait').on('click', function() {
        $('#offer_modal').hide();
    });
    
    OfferDisplay.showOffer = function(month, continents, offer) {
        var segment1 = continents[offer.offeringContinent] + ' is offering '
        var segment2 = ' if you ';
        var good = 'nothing';
        var bad = 'do nothing';
        if (offer.giveAgent) {
            good = 'one agent';
        } else if (offer.giveSquad) {
            good = 'one squadron';
        } else  if (offer.scienceToGive > 0) {
            good = offer.scienceToGive + ' scientist' + (offer.scienceToGive > 1 ?  's' : '');
        }

        if (offer.removeAgent || offer.removeSquad) {
            bad = 'remove your ' +
                (offer.removeAgent ? 'agent' : 'squad') + ' from ' +
                continents[offer.offendingContinent] + ' for ' +
                offer.duration + ' months';
        } else {
            bad = 'give them ' + offer.scienceToReceive + ' scientists';
        }

        var goodSpan = $('<span/>').text(good).css('color', '#0a0');
        var badSpan = $('<span/>').text(bad).css('color', '#d00');

        $('#offer_title').text(c.months[month%c.months.length] + ', ' + Math.floor(c.startYear+month/12));

        $('#offer_text').empty();
        $('#offer_text').append(segment1).append(goodSpan).append(segment2).append(badSpan).append('.');

        $('#offer_accept').unbind('click');
        $('#offer_accept').on('click', function() {
            $('#offer_accept').unbind('click');
            $('#offer_modal').hide();
            $(window).trigger('OfferAccept', offer);
        });

        $('#offer_modal').show();
    }

    return OfferDisplay;
});
