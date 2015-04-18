
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
        this.elem.append('<h1>' + continents[index] + '</h1>');
        this.elem.append('<p>Strength: ' + stats[index].strength + '</p>');
        this.elem.append('<p>Stability: ' + stats[index].stability + '</p>');

        if (stats.hasAgents) {
            this.elem.append('<p>Agents deployed on this continent.</p>');
        }

        if (stats.hasSquad) {
            this.elem.append('<p>Squadron deployed on this continent.</p>');
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
