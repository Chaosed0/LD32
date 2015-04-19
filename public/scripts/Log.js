
define(['jquery', './Util', './Constants'], function($, u, c) {

    var Log = function(logElem, continents) {
        var self = this;
        this.continents = continents;
        this.log = logElem;

        $(window).bind("NewMonthLog", function(e, month) {
            self.message($('<p>It is now ' + c.months[month%c.months.length] + ', ' + (c.startYear+Math.floor(month/12)) + '.</p>'));
        });
        $(window).bind("NewWar", function(e, data) {
            var message = $('<p/>').css('color', '#a00');
            var span1 = $('<span>' + continents[data.first] + '</span>').css('color', '#d00');
            var span2 = $('<span>' + continents[data.second] + '</span>').css('color', '#d00');
            message.append('War breaks out between ')
                .append(span1)
                .append(' and ')
                .append(span2)
                .append('!');
            self.message(message);
        });
        $(window).bind("UIDisplay", function() {
            self.log.scrollTop(self.log[0].scrollHeight);
        });
        $(window).bind("OfferAccept", function(e, offer) {
            self.message($('<p>You accepted ' + self.continents[offer.offeringContinent] + '\'s offer.'));
        });
    }

    Log.prototype.maxMessages = 50;

    Log.prototype.message = function(message) {
        this.log.append(message);
        if (this.log.children().length > this.maxMessages) {
            this.log.find('p:first').remove();
        }
        this.log.scrollTop(this.log[0].scrollHeight);
    }
    
    return Log;
})
