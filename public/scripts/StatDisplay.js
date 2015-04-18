
define(['jquery', './Util', './UIElem'], function($, u, UIElem) {
    const goodWarColor = '#b00';
    const badWarColor = '#f00';
    const peaceColor = '#0a0';

    var StatDisplay = function() {
        this.elem.css({
            'width': '250px',
        });
        this.elem.setPos(20, 20);
    }
    StatDisplay.prototype = new UIElem();
    StatDisplay.prototype.constructor = StatDisplay;

    StatDisplay.prototype.displayStats = function(continents, stats, index) {
        this.elem.empty();

        var strengthText = 'Strength: ' + stats[index].strength;
        var stabilityText = 'Stability: ' + stats[index].stability;
        if (stats[index].hasSquad) {
            strengthText += ' (+5)';
        }

        this.elem.append('<h1>' + continents[index] + '</h1>');
        this.elem.append($('<p/>').text(strengthText));
        this.elem.append($('<p/>').text(stabilityText));

        if (stats[index].hasAgents) {
            this.elem.append($('<p/>').text('Agents deployed on this continent.'));
        }

        if (stats[index].hasSquad) {
            this.elem.append($('<p/>').text('Squadron deployed on this continent.'));
        }

        this.elem.append('<h2>Wars</h2>');
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
    
    return StatDisplay;
});
