
require(['jquery', './Util', './GameObj',
        './StatDisplay',
        './WarDisplay',
        ], function($, u, GameObj, StatDisplay, WarDisplay) {

    var self = this;

    const initialWars = 3;

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

    var continentStats = [];
    var continentWars = [];

    for (var i = 0; i < continents.length; i++) {
        var stats = {
            power: Math.floor(u.getRandom(0, 10)),
            stability: Math.floor(u.getRandom(90, 100))
        }
        continentStats.push(stats);
    }

    for (var i = 0; i < continents.length; i++) {
        continentWars.push([]);
        for (var j = 0; j < continents.length; j++) {
            continentWars[i].push(false);
        }
    }

    for(var i = 0; i < initialWars; i++) {
        var first = Math.floor(u.getRandom(0, continents.length));
        var second = Math.floor(u.getRandom(0, continents.length));
        if (first != second && !continentWars[first][second]) {
            continentWars[first][second] = true;
            continentWars[second][first] = true;
        } else {
            --i;
        }
    }

    var width = $(window).width();
    var height = $(window).height();

    var map = GameObj('#map');
    var ratio = Math.min(width / map[0].clientWidth, height / map[0].clientHeight);
    console.log(ratio);
    map.width(map.width() * ratio);
    map.height(map.height() * ratio);
    map.setPos((width - map.width())/2.0, (height - map.height())/2.0);
    map.css('z-index', -1000);

    var continentStatDisplay = new StatDisplay();
    var continentWarDisplay = new WarDisplay();

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
            label.mousedown(function() {
                continentStatDisplay.displayStats(continents[index], continentStats[index]);
                continentWarDisplay.displayRelations(continents, continentWars, index);
                continentStatDisplay.visible(true);
                continentWarDisplay.visible(true);
            });
        })();

        $('body').append(label);
        label.width(label.width()*1.5);
        label.height(label.height()*3);
        label.setPos(map.position.x + map.width() * position.x - label[0].clientWidth/2,
                     map.position.y + map.height() * position.y - label[0].clientHeight/2);
    }

});
