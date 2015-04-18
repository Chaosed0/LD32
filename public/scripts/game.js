
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

            /* Add progress on bomb if our agents aren't present */
            if (!stats.hasAgents) {
                stats.progress += stats.science;
            }

            /* Calculate impact of wars on stability */
            for (var j = 0; j < stats.wars.length; j++) {
                if (stats.wars[j]) {
                    var relativeStrength = stats.getEffectiveStrength() - continentStats[j].getEffectiveStrength();
                    /* If relativeStrength is less than zero and the country
                     * has one of our squads defending it, don't subtract */
                    if (!stats.hasSquad || relativeStrength > 0) {
                        stats.stability += relativeStrength;
                    }
                }
            }
        }

        /* Add to strength only after we're done calculating war effects */
        for (var i = 0; i < continents.length; i++) {
            var stats = continentStats[i];
            stats.strength += Math.floor(u.getRandom(stats.science/2, stats.science));
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

    $(window).on('NewMonth', function() {
        /* Update our bomb progress on a new month */
        ourBombProgress.setProgress(playerStats.progress);
    });

    var displayUI = function() {
        if (selectedContinent === null) {
            return;
        }
        continentStatDisplay.displayStats(continents, continentStats, selectedContinent);
        actionDisplay.displayActions(continentStats[selectedContinent], playerStats, function() {
            /* Re-display UI if an action is taken */
            displayUI(continent);
        });
        continentStatDisplay.visible(true);
        actionDisplay.visible(true);

        if (continentBombProgress !== null) {
            continentBombProgress.destroy();
        }
        continentBombProgress = new BombProgress(false, continentStats[selectedContinent].progress, continents[selectedContinent]);
    };

    $(window).on('NewMonth', displayUI);

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

        label.hover(function() {
            $(this).css('color', '#0000FF');
        }, function() {
            $(this).css('color', '#000000');
        });

        (function() {
            var index = i;
            label.mousedown(function() { selectedContinent = index; displayUI(); });
        })();

        $('body').append(label);
        label.width(label.width()*1.5);
        label.height(label.height()*3);
        label.setPos(map.position.x + map.width() * position.x - label.width()/2,
                     map.position.y + map.height() * position.y - label.height()/2);
        labels.push(label);
    }

    var nextMonthButton = GameObj('<button type="button"/>');
    nextMonthButton.text("Commit Strategy");
    nextMonthButton.width(150);
    nextMonthButton.height(50);
    nextMonthButton.setPos($(window).width() - nextMonthButton.width() - 20,
                           $(window).height() - nextMonthButton.height() - 20);
    nextMonthButton.click(nextMonth);
    $('body').append(nextMonthButton);
});
