
define(['jquery', './Util', './UIElem'], function($, u, UIElem) {
    var StatDisplay = function() {
        this.elem.css({
            'width': '250px',
            'height': '150px'
        });
        this.elem.setPos(20, 50);
    }
    StatDisplay.prototype = new UIElem();
    StatDisplay.prototype.constructor = StatDisplay;

    StatDisplay.prototype.displayStats = function(continent, stats) {
        this.elem.empty();
        this.elem.append('<h1>' + continent + '</h1>');
        this.elem.append('<p>Power: ' + stats.power + '</p>');
        this.elem.append('<p>Stability: ' + stats.stability + '</p>');
    }
    
    return StatDisplay;
});
