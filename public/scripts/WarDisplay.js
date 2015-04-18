
define(['jquery', './Util', './UIElem'], function($, u, UIElem) {
    const goodWarColor = '#b00';
    const badWarColor = '#f00';
    const peaceColor = '#0f0';

    var WarDisplay = function() {
        this.elem.css({
            'width': '250px',
        });
        this.elem.setPos($(window).width() - 20 - 250, 50);
    }
    WarDisplay.prototype = new UIElem();
    WarDisplay.prototype.constructor = WarDisplay;

    WarDisplay.prototype.displayWars = function(continents, stats, index) {
        this.elem.empty();
        this.elem.append('<h1>Wars</h1>');
        var wars = stats[index].wars;
        var atWar = false;
        for (var i = 0; i < wars.length; i++) {
            if (!wars[i]) {
                continue;
            }
            atWar = true;

            var relativeStrength = stats[index].strength - stats[i].strength;

            var label = $('<p/>').text(continents[i] + ' (' + relativeStrength + ')');
            label.css('color', (relativeStrength >= 0 ? goodWarColor : badWarColor));
            this.elem.append(label);
        }

        if (!atWar) {
            var label = $('<p/>').text('Peacetime!');
            label.css('color', peaceColor);
            this.elem.append(label);
        }
    }
    
    return WarDisplay;
});
