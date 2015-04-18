
require(['jquery', './Util', './GameObj'], function($, u, GameObj) {

    var self = this;

    var labelProps = [
        {
            name: 'North America',
            x: 0.2,
            y: 0.3,
        },
        {
            name: 'South America',
            x: 0.3,
            y: 0.6,
        },
        {
            name: 'Africa',
            x: 0.525,
            y: 0.45,
        },
        {
            name: 'Europe',
            x: 0.55,
            y: 0.225,
        },
        {
            name: 'Asia',
            x: 0.7,
            y: 0.3,
        },
        {
            name: 'Australia',
            x: 0.85,
            y: 0.675,
        },
    ];

    var width = $(window).width();
    var height = $(window).height();

    var map = GameObj('#map');
    var ratio = Math.min(width / map[0].clientWidth, height / map[0].clientHeight);
    console.log(ratio);
    map.width(map.width() * ratio);
    map.height(map.height() * ratio);
    map.setPos((width - map.width())/2.0, (height - map.height())/2.0);
    map.css('z-index', -1000);

    for (var i = 0; i < labelProps.length; i++) {
        var props = labelProps[i];
        var label = GameObj('<div/>').text(props.name);
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

        $('body').append(label);
        label.width(label.width()*1.5);
        label.height(label.height()*3);
        label.setPos(map.position.x + map.width() * props.x - label[0].clientWidth/2,
                     map.position.y + map.height() * props.y - label[0].clientHeight/2);
    }
});
