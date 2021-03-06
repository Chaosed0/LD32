
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
        var researchText = 'Scientists: ' + stats.science;
        if (stats.squads > 0) {
            strengthText += ' (+' + stats.squads * 5 + ')';
        }

        if (stats.addlScience > 0) {
            researchText += ' (+' + stats.addlScience + ')';
        }

        elem.append($('<p/>').text(strengthText));
        elem.append($('<p/>').text(stabilityText));
        elem.append($('<p/>').text(researchText));

        if (stats.agentBlockedDuration > 0) {
            elem.append($('<p/>').css('color', '#f00')
                    .text('Agents blocked here for ' + stats.agentBlockedDuration + ' more turns.'));
        }

        if (stats.squadBlockedDuration > 0) {
            elem.append($('<p/>').css('color', '#f00')
                    .text('Squads blocked here for ' + stats.squadBlockedDuration + ' more turns.'));
        }

        if (stats.hasAgent) {
            elem.append($('<p/>').text('Agent protecting stability.').css('color', 'green'));
        }

        if (stats.squads > 0) {
            elem.append($('<p/>').text('Strength boosted by ' + stats.squads + ' squad' +
                        (stats.squads > 1 ? 's' : '') + '.').css('color', 'green'));
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
            /* If we've got an agent and are being attacked, or if the other continent
             * has an agent and we're attacking them, strength is 0 */
            if ((stats.hasAgent && relativeStrength < 0) || (continentStats[i].hasAgent && relativeStrength > 0)) {
                relativeStrength = 0;
            }

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
