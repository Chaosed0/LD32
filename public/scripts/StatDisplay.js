
define(['jquery', './Util', './UIElem'], function($, u, UIElem) {
    var StatDisplay = function() {
        this.elem.css({
            'width': '250px',
        });
        this.elem.setPos(20, 50);
    }
    StatDisplay.prototype = new UIElem();
    StatDisplay.prototype.constructor = StatDisplay;

    StatDisplay.prototype.displayStats = function(continent, stats) {
        this.elem.empty();
        this.elem.append('<h1>' + continent + '</h1>');
        this.elem.append('<p>Strength: ' + stats.strength + '</p>');
        this.elem.append('<p>Stability: ' + stats.stability + '</p>');

        if (stats.hasAgents) {
            this.elem.append('<p>Agents deployed on this continent.</p>');
        }

        if (stats.hasSquad) {
            this.elem.append('<p>Squadron deployed on this continent.</p>');
        }
    }
    
    return StatDisplay;
});
