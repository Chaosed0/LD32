
require(['jquery', './Util', './GameObj',
        './StatDisplay',
        './ActionDisplay',
        './BombProgress',
        './ContinentStats',
        ], function($, u, GameObj, StatDisplay, ActionDisplay, BombProgress, ContinentStats) {

    var self = this;

    const initialWars = 3;
    const initialAgents = 2;
    const initialSquads = 1;
    const initialScience = 5;

    var continents = [
        'North America',
        'South America',
        'Africa',
        'Europe',
        'Asia',
        'Australia',
    ];

    var labelPositions = [
        { x: 0.2, y: 0.3 },
        { x: 0.3, y: 0.6 },
        { x: 0.525, y: 0.45 },
        { x: 0.55, y: 0.225 },
        { x: 0.7, y: 0.3 },
        { x: 0.85, y: 0.675 },
    ];

    var labels = [];
    var continentStats = [];

    var playerStats = {
        agents: initialAgents,
        squads: initialSquads,
        science: initialScience,
        progress: 0
    }

    for (var i = 0; i < continents.length; i++) {
        continentStats.push(new ContinentStats());
    }

    for (var i = 0; i < continents.length; i++) {
        for (var j = 0; j < continents.length; j++) {
            continentStats[i].wars.push(false);
        }
    }

    for(var i = 0; i < initialWars; i++) {
        var first = Math.floor(u.getRandom(0, continents.length));
        var second = Math.floor(u.getRandom(0, continents.length));
        if (first != second && !continentStats[first].wars[second]) {
            continentStats[first].wars[second] = true;
            continentStats[second].wars[first] = true;
        } else {
            --i;
        }
    }

    var nextMonth = function() {
        playerStats.progress += playerStats.science;
        for (var i = 0; i < continents.length; i++) {
            var stats = continentStats[i];
            var numWars = 0;
            
            /* If this country has fallen, no need to calculate */
            if (stats.stability <= 0) {
                continue;
            }

            /* Add progress on bomb if our agents aren't present */
            if (!stats.hasAgents) {
                stats.progress += stats.science;
            }

            /* Calculate impact of wars on stability */
            for (var j = 0; j < stats.wars.length; j++) {
                if (!stats.wars[j]) {
                    continue;
                }

                var relativeStrength = stats.getEffectiveStrength() - continentStats[j].getEffectiveStrength();
                /* If the country has one of our squads defending it, don't subtract */
                if (!stats.hasSquad && relativeStrength < 0) {
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

                    var victorStats = continentStats[j];
                    victorStats.strength += Math.ceil(stats.strength/numWars);
                    victorStats.science += Math.ceil(stats.science/numWars);
                    victorStats.progress += Math.ceil(stats.progress/4);

                    /* If the country had agents/squads in it, give them back */
                    if (stats.hasAgents) {
                        stats.hasAgents = false;
                        playerStats.agents++;
                    }

                    if (stats.hasSquad) {
                        stats.hasSquad = false;
                        playerStats.squad++;
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
            stats.strength += Math.floor(u.getRandom((10 - stats.science)/2, (10 - stats.science)));
        }

        $(window).trigger("NewMonth");
    }

    var width = $(window).width();
    var height = $(window).height();

    var map = GameObj('#map');
    var mapWidth = map.width();
    var mapHeight = map.height();
    var ratio = Math.min(width / mapWidth, height / mapHeight);
    console.log(ratio);
    map.width(mapWidth * ratio);
    map.height(mapHeight * ratio);
    map.setPos((width - map.width())/2.0, (height - map.height())/2.0);
    map.css('z-index', -1000);

    var continentStatDisplay = new StatDisplay();
    var actionDisplay = new ActionDisplay();
    var ourBombProgress = new BombProgress(true, playerStats.progress);
    var continentBombProgress = null;
    var selectedContinent = null;

    /* Update our bomb progress on a new month */
    $(window).on('NewMonth', function() {
        ourBombProgress.setProgress(playerStats.progress);
    });

    var displayUI = function() {
        continentStatDisplay.displayStats(continents, continentStats, selectedContinent);
        actionDisplay.displayActions(continentStats[selectedContinent], playerStats)
        continentStatDisplay.visible(true);
        actionDisplay.visible(true);

        if (selectedContinent != null) {
            if (continentBombProgress !== null) {
                continentBombProgress.destroy();
            }
            continentBombProgress = new BombProgress(false, continentStats[selectedContinent].progress, continents[selectedContinent]);
        }
    };
    /* Display the UI */
    displayUI();
    /* Re-display UI on a new month */
    $(window).on('NewMonth', displayUI);
    /* Re-display UI if an action is taken */
    actionDisplay.elem.on("Action", displayUI);

    var reddenLabel = function(index) {
        var label = labels[index];
        var stability = continentStats[index].stability;
        var redness;
        if (stability > 0) {
            redness = Math.floor(200*(100-continentStats[index].stability)/100);
        } else {
            redness = 255;
        }
        label.css('color', 'rgba(' + redness + ',0,0,1.0)');
    }

    for (var i = 0; i < continents.length; i++) {
        var position = labelPositions[i];
        var label = GameObj('<div/>').text(continents[i]);
        label.css({
            'font-size': '250%',
            'user-select': 'none',
            'cursor': 'default',
            'text-align': 'center',
            'display': 'flex',
            'justify-content': 'center',
            'align-content': 'center',
            'flex-direction': 'column',
        });

        (function() {
            var index = i;
            label.mousedown(function() { selectedContinent = index; displayUI(); });

            label.hover(function() {
                $(this).css('color', '#0000FF');
            }, function() {
                reddenLabel(index);
            });
        })();

        $('body').append(label);
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

    var nextMonthButton = GameObj('<button type="button"/>');
    nextMonthButton.text("Commit Strategy");
    nextMonthButton.width(150);
    nextMonthButton.height(50);
    nextMonthButton.setPos($(window).width() - nextMonthButton.width() - 20,
                           $(window).height() - nextMonthButton.height() - 20);
    nextMonthButton.click(nextMonth);
    $('body').append(nextMonthButton);
});
