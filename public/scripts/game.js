
require(['jquery', './Util', './Constants',
        './GameObj',
        './StatDisplay',
        './ActionDisplay',
        './BombProgress',
        './OfferDisplay',
        './ContinentStats',
        './Log',
        './Arc',
        './Offer',
        ], function($, u, c, GameObj, StatDisplay, ActionDisplay, BombProgress, OfferDisplay, ContinentStats, Log, Arc, Offer) {

    var self = this;

    const initialWars = 3;
    const initialAgents = 1;
    const initialSquads = 2;
    const initialScience = 7;
    const warInterval = 3;

    var continents = [
        'North America',
        'South America',
        'Africa',
        'Europe',
        'Asia',
        'Australia',
    ];

    var labelPositions = [
        { x: 0.16, y: 0.35 },
        { x: 0.27, y: 0.7 },
        { x: 0.525, y: 0.55 },
        { x: 0.55, y: 0.26 },
        { x: 0.725, y: 0.35 },
        { x: 0.88, y: 0.78 },
    ];

    var labels = [];
    var labelFlashes = [];
    var continentStats = [];

    var playerStats = {
        agents: initialAgents,
        squads: initialSquads,
        science: initialScience,
        progress: 0
    }

    var month = 0;
    var offer = 0;
    var log = new Log($('#log'), continents);
    /* Log the first month */
    $(window).trigger("NewMonthLog", month);

    for (var i = 0; i < continents.length; i++) {
        continentStats.push(new ContinentStats());
    }

    for (var i = 0; i < continents.length; i++) {
        for (var j = 0; j < continents.length; j++) {
            continentStats[i].wars.push(false);
        }
    }

    var newWar = function() {
        var first, second;
        var iterations = 0;
        do {
            first = Math.floor(u.getRandom(0, continents.length));
            second = Math.floor(u.getRandom(0, continents.length));
            /* total cheating, just in case someone goes for the long war */
            ++iterations;
        } while ((first == second || continentStats[first].wars[second]) && iterations < 1000);

        if (iterations < 1000) {
            continentStats[first].wars[second] = true;
            continentStats[second].wars[first] = true;
            $(window).trigger("NewWar", {first: first, second: second});
        }
    }

    var nextMonth = function() {
        var conqueredContinent = null;
        month++;
        /* We want to log the new month before the new war */
        $(window).trigger("NewMonthLog", month);

        /* Add progress to the mind control bomb */
        playerStats.progress = Math.min(playerStats.progress + playerStats.science, c.winProgress);

        for (var i = 0; i < continents.length; i++) {
            var stats = continentStats[i];
            var numWars = 0;
            
            /* If this country has fallen, no need to calculate */
            if (stats.stability <= 0) {
                continue;
            }

            /* Calculate impact of wars on stability */
            for (var j = 0; j < stats.wars.length; j++) {
                if (!stats.wars[j]) {
                    continue;
                }

                var relativeStrength = stats.getEffectiveStrength() - continentStats[j].getEffectiveStrength();
                /* If no agent on continent, subtract relative strength from stability */
                if (!stats.hasAgent && relativeStrength < 0) {
                    stats.stability += relativeStrength;
                }
                ++numWars;
            }

            /* If a country has fallen, we lost */
            if (stats.stability <= 0) {
                stats.conqueror = continents[stats.wars.indexOf(true)];
                conqueredContinent = i;
            }
        }

        /* Modify stats only after we're done calculating war effects */
        for (var i = 0; i < continents.length; i++) {
            var stats = continentStats[i];
            stats.strength += stats.getEffectiveScience();
            stats.agentBlockedDuration = Math.max(0, stats.agentBlockedDuration-1);
            stats.squadBlockedDuration = Math.max(0, stats.squadBlockedDuration-1);

            if (Math.random() >= 0.5) {
                stats.science++;
            }
        }

        /* Every so often, a new war breaks out */
        if (month != 0 && month % warInterval == 0) {
            newWar();
        }

        /* A new offer is made every turn other than turn 0 */
        if (month != 0) {
            offer = new Offer(continentStats, playerStats);
            offer.makeRandom();
            $(window).trigger('NewOffer', offer);
        }

        /* If we won, trigger victory and don't do offer */
        if (conqueredContinent == null && playerStats.progress >= c.winProgress) {
            $(window).trigger('Victory');
            offer = null;
        }
        /* If we lost, trigger defeat and don't do offer */
        if (conqueredContinent != null) {
            $(window).trigger('Defeat', conqueredContinent);
            offer = null;
        }

        $(window).trigger('NewMonth', {month: month, offer: offer});
    }

    $(window).on('OfferAccept', function(e, offer) {
        offer.accept(continentStats, playerStats);
    });

    var mainWidth = $('#map_container').width();
    var mainHeight = $('#map_container').height();

    var map = GameObj('#map');
    var mapWidth = map.width();
    var mapHeight = map.height();
    var ratio = Math.min(mainWidth / mapWidth, mainHeight / mapHeight);
    console.log(ratio);
    map.width(mapWidth * ratio);
    map.height(mapHeight * ratio);
    map.setPos($('#sidebar').width() + (mainWidth - map.width())/2.0, (mainHeight - map.height())/2.0);

    var ourBombProgress = new BombProgress(true, playerStats.progress);
    var selectedContinent = null;

    $(window).on('NewMonth', function(e, data) {
        ourBombProgress.setProgress(playerStats.progress);

        /* Show the offer */
        if (data.offer !== null) {
            OfferDisplay.showOffer(data.month, continents, data.offer);
        }
    });

    var displayUI = function() {
        StatDisplay.displayStats(continents, continentStats, selectedContinent);
        ActionDisplay.displayActions(continentStats[selectedContinent], playerStats)
        $(window).trigger("UIDisplay");
    };
    /* Display the UI */
    displayUI();
    /* We have to re-display the UI any time stats change */
    $(window).on('NewMonth', displayUI);
    $(window).on('OfferAccept', displayUI);
    $(window).on('ActionTaken', displayUI);

    var flashLabel = function(label) {
        /* Cross-browser color comparison, what a hack */
        var red = $('<p>').css('color', '#f00').css('color');
        if (label.css('color') == red) {
            label.css('color', '#ddd');
        } else {
            label.css('color', '#f00');
        }
    }

    var reddenLabel = function(index) {
        var label = labels[index];
        var stats = continentStats[index];
        var stability = stats.stability;

        /* Check if the continent is about to fall */
        var totalStabilityLoss = 0;
        if (!stats.hasAgent) {
            /* If the continent has an agent, we know it isn't going to fall */
            for (var i = 0; i < stats.wars.length; i++) {
                if (stats.wars[i] === true) {
                    var relativeStrength = stats.getEffectiveStrength() -
                        continentStats[i].getEffectiveStrength();
                    if (relativeStrength < 0) {
                        totalStabilityLoss += relativeStrength;
                    }
                }
            }
        }

        if (stats.stability + totalStabilityLoss < 0) {
            flashLabel(labels[index]);
            /* Don't set interval again if we're already flashing */
            if (labelFlashes[index] === null) {
                /* Flash the label - we're about to fall */
                labelFlashes[index] = setInterval(function() { flashLabel(labels[index]); }, 1000);
            }
        } else if (labelFlashes[index] !== null) {
            /* If the label was flashing before, stop it */
            clearInterval(labelFlashes[index]);
            labelFlashes[index] = null;
        }

        if (labelFlashes[index] === null) {
            /* Not flashing - Calculate the solid color */
            var notRed = Math.floor(255*stats.stability/ContinentStats.maxStability);
            label.css('color', 'rgba(255,' + notRed + ',' + notRed + ',1.0)');
        }
    }

    for (var i = 0; i < continents.length; i++) {
        var position = labelPositions[i];
        var label = GameObj('<div class="text-container continent-label"/>').text(continents[i].toUpperCase());

        (function() {
            var index = i;
            label.mousedown(function() {
                selectedContinent = index;
                displayUI();
            });

            label.hover(function() {
                $(this).css('color', '#0000FF');
            }, function() {
                reddenLabel(index);
            });
        })();

        $('#map_container').append(label);
        label.width(label.width()*1.5);
        label.height(label.height()*3);
        label.setPos(map.position.x + map.width() * position.x - label.width()/2,
                     map.position.y + map.height() * position.y - label.height()/2);
        labels.push(label);
        labelFlashes.push(null);
    }

    var reddenAllLabels = function() {
        for (var i = 0; i < continents.length; i++) {
            var label = labels[i];
            reddenLabel(i);
        }
    }

    $(window).on('ActionTaken', reddenAllLabels);
    $(window).on("NewMonth", reddenAllLabels);

    $(window).on('Victory', function(e) {
        $('#victory_modal').show();
    });

    $(window).on('Defeat', function(e, index) {
        $('#defeat_message').text(continents[index] + ' has fallen to ' + continentStats[index].conqueror + '.');
        $('#defeat_modal').show();
    });

    $(window).on('NewWar', function(e, data) {
        var label1 = labels[data.first];
        var label2 = labels[data.second];
        var p1 = {x: label1.position.x + label1.width()/2, y: label1.position.y + label1.height()/2};
        var p2 = {x: label2.position.x + label2.width()/2, y: label2.position.y + label2.height()/2};
        var arc = new Arc(p1, p2);
    });

    var nextMonthButton = GameObj('<button type="button" class="button"/>');
    nextMonthButton.text("NEXT MONTH");
    nextMonthButton.width(150);
    nextMonthButton.height(50);
    nextMonthButton.setPos($(window).width() - nextMonthButton.width() - 20,
                           $(window).height() - nextMonthButton.height() - 20);
    nextMonthButton.click(nextMonth);
    $('#map_container').append(nextMonthButton);

    var viewOfferButton = GameObj('<button type="button" class="button"/>');
    viewOfferButton.text("VIEW CURRENT OFFER");
    viewOfferButton.width(150);
    viewOfferButton.height(25);
    viewOfferButton.setPos($('#sidebar').width() + 25, 20);
    viewOfferButton.click(function() { OfferDisplay.showOffer(month, continents, offer); });
    viewOfferButton.hide();
    $('#map_container').append(viewOfferButton);

    var viewHelp = GameObj('<button type="button" class="button"/>');
    viewHelp.text("HELP");
    viewHelp.width(50);
    viewHelp.height(25);
    viewHelp.setPos($(window).width() - viewHelp.width() - 20, 20);
    viewHelp.click(function() { $('#help_modal').show() });
    $('#hide_help').click(function() { $('#help_modal').hide() });
    $('#map_container').append(viewHelp);

    /* Show the button on a new offer; hide it when an offer is accepted */
    $(window).on("NewOffer", function() { viewOfferButton.show(); });
    $(window).on("OfferAccept", function() { viewOfferButton.hide(); });

    /* Initialize wars */
    for(var i = 0; i < initialWars; i++) {
        newWar();
    }

    /* Show intro */
    $('#intro_modal').show();
    $('#hide_intro').click(function() { $('#intro_modal').hide(); });
});
