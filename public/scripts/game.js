
require(['jquery', './Util', './GameObj',
        './StatDisplay',
        './ActionDisplay',
        './BombProgress',
        './ContinentStats',
        './Log',
        ], function($, u, GameObj, StatDisplay, ActionDisplay, BombProgress, ContinentStats, Log) {

    var self = this;

    const initialWars = 3;
    const initialAgents = 1;
    const initialSquads = 2;
    const initialScience = 5;
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
    var continentStats = [];

    var playerStats = {
        agents: initialAgents,
        squads: initialSquads,
        science: initialScience,
        progress: 0
    }

    var month = 0;
    var log = new Log(continents);
    /* Log the first month */
    $(window).trigger("NewMonth", month);

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
        /* Potential for an infinite loop here if all countries are at war,
         * but I'm fairly certain the game will never go on for that long */
        do {
            first = Math.floor(u.getRandom(0, continents.length));
            second = Math.floor(u.getRandom(0, continents.length));
        } while (first == second || continentStats[first].wars[second]);
        continentStats[first].wars[second] = true;
        continentStats[second].wars[first] = true;
        $(window).trigger("NewWar", {first: first, second: second});
    }

    for(var i = 0; i < initialWars; i++) {
        newWar();
    }

    var nextMonth = function() {
        month++;
        $(window).trigger("NewMonth", month);

        playerStats.progress += playerStats.science;
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

            /* If the country has just fallen, split its assets among the victors */
            if (stats.stability <= 0) {
                var warCount = 0;
                stats.conqueror = '';
                for(var j = 0; j < stats.wars.length; j++) {
                    if (!stats.wars[j]) {
                        continue;
                    }

                    if (warCount != 0 && numWars > 2) {
                        stats.conqueror += ',';
                    }
                    /* Figure out whether we should put 'and' in or not */
                    if (warCount == numWars - 1 && numWars > 1) {
                        stats.conqueror += ' and';
                    }
                    stats.conqueror += ' ' + continents[j];
                    ++warCount;

                    stats.wars[j] = false;
                    continentStats[j].wars[i] = false;
                }
            }
        }

        /* Add to strength only after we're done calculating war effects */
        for (var i = 0; i < continents.length; i++) {
            var stats = continentStats[i];
            stats.strength += Math.floor(u.getRandom(stats.science, stats.science));
        }

        /* Every so often, a new war breaks out */
        if (month != 0 && month % warInterval == 0) {
            newWar();
        }
    }

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

    /* Update our bomb progress on a new month */
    $(window).on('NewMonth', function() {
        ourBombProgress.setProgress(playerStats.progress);
    });

    var displayUI = function() {
        StatDisplay.displayStats(continents, continentStats, selectedContinent);
        ActionDisplay.displayActions(continentStats[selectedContinent], playerStats)
        $(window).trigger("UIDisplay");
    };
    /* Display the UI */
    displayUI();
    /* Re-display UI on a new month */
    $(window).on('NewMonth', displayUI);
    /* Re-display UI if an action is taken */
    ActionDisplay.setActionCallback(displayUI);

    var reddenLabel = function(index) {
        var label = labels[index];
        var stability = continentStats[index].stability;
        var other;
        if (stability > 0) {
            other = Math.floor(200*continentStats[index].stability/100 + 55);
        } else {
            other = 0;
        }
        label.css('color', 'rgba(255,' + other + ',' + other + ',1.0)');
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
    }

    $(window).on("NewMonth", function(e) {
        for (var i = 0; i < continents.length; i++) {
            var label = labels[i];
            reddenLabel(i);
        }
    });

    var nextMonthButton = GameObj('<button type="button" class="button"/>');
    nextMonthButton.text("COMMIT");
    nextMonthButton.width(150);
    nextMonthButton.height(50);
    nextMonthButton.setPos($(window).width() - nextMonthButton.width() - 20,
                           $(window).height() - nextMonthButton.height() - 20);
    nextMonthButton.click(nextMonth);
    $('#map_container').append(nextMonthButton);
});
