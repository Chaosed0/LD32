
define(['jquery', './Util'], function($, u) {
    const goodWarColor = '#b00';
    const badWarColor = '#f00';
    const peaceColor = '#0a0';

    var StatDisplay = {};
    var elem = $('#stats');

    StatDisplay.displayStats = function(continents, continentStats, index) {
        elem.empty();

        if (index === null) {
            elem.append('<b>No continent selected</b>');
            return;
        }

        var stats = continentStats[index];

        elem.append('<h1>' + continents[index] + '</h1>');

        if (stats.stability <= 0) {
            u.assert(stats.conqueror !== null);
            elem.append($('<p/>').text("Conquered by " + stats.conqueror).css('color', 'red'));
            return;
        }

        var strengthText = 'Strength: ' + stats.strength;
        var stabilityText = 'Stability: ' + stats.stability;
        if (stats.hasSquad) {
            strengthText += ' (+5)';
        }

        elem.append($('<p/>').text(strengthText));
        elem.append($('<p/>').text(stabilityText));

        if (stats.hasAgents) {
            elem.append($('<p/>').text('Bomb progress inhibited by agent.'));
        }

        if (stats.hasSquad) {
            elem.append($('<p/>').text('Stability protected by squadron.'));
        }

        elem.append('<h2>Wars</h2>');
        var wars = stats.wars;
        var atWar = false;
        for (var i = 0; i < wars.length; i++) {
            if (!wars[i]) {
                continue;
            }
            atWar = true;

            var relativeStrength = stats.getEffectiveStrength() - continentStats[i].getEffectiveStrength();

            var label = $('<p/>').text(continents[i] + ' (' + relativeStrength + ')');
            label.css('color', (relativeStrength >= 0 ? goodWarColor : badWarColor));
            elem.append(label);
        }

        if (!atWar) {
            var label = $('<p/>').text('Peacetime!');
            label.css('color', peaceColor);
            elem.append(label);
        }
    }
    
    return StatDisplay;
});
