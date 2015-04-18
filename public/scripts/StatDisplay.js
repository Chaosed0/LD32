
define(['jquery', './Util', './GameObj'], function($, u, GameObj) {
    var StatDisplay = function() {
        var elem = GameObj('<div/>');
        elem.css({
            'outline': '1px solid #aaa',
            'background-color': '#eee',
            'padding': '5px',
            'width': '250px',
            'height': '150px'
        });

        $('body').append(elem);
        elem.setPos(20, 50);

        this.elem = elem;

        this.visible(false);
    }

    StatDisplay.prototype.displayStats = function(continent, stats) {
        this.elem.empty();
        this.elem.append('<h1>' + continent + '</h1>');
        this.elem.append('<p>Power: ' + stats.power + '</p>');
        this.elem.append('<p>Stability: ' + stats.stability + '</p>');
    }

    StatDisplay.prototype.visible = function(isVisible) {
        if (isVisible !== undefined) {
            if (isVisible) {
                this.elem.css('visibility', 'visible');
            } else {
                this.elem.css('visibility', 'hidden');
            }
        } else {
            return this.elem.css('visibility') === 'visible';
        }
    }
    
    return StatDisplay;
});
