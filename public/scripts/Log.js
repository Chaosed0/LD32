
define(['jquery', './Util'], function($, u) {

    var months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var Log = function(logElem, continents) {
        var self = this;
        this.continents = continents;
        this.year = 2034;
        this.log = logElem;

        $(window).bind("NewMonth", function(e, month) {
            if (month != 0 && month%12 == 0) {
                ++self.year;
            }
            self.message($('<p>It is now ' + months[month%months.length] + ', ' + self.year + '.</p>'));
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
