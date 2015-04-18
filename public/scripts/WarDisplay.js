
define(['jquery', './Util', './UIElem'], function($, u, UIElem) {
    const warColor = '#f00';
    const peaceColor = '#0f0';
    const selfColor = '#00f';

    var WarDisplay = function() {
        this.elem.css({
            'width': '250px',
        });
        this.elem.setPos($(window).width() - 20 - 250, 50);
    }
    WarDisplay.prototype = new UIElem();
    WarDisplay.prototype.constructor = WarDisplay;

    WarDisplay.prototype.displayRelations = function(continents, wars, index) {
        this.elem.empty();
        this.elem.append('<h1>Relations</h1>');
        for (var i = 0; i < wars[index].length; i++) {
            var label = $('<p/>').text(continents[i]);
            if (index != i) {
                label.css('color', (wars[index][i] ? warColor : peaceColor));
            } else {
                label.css('color', selfColor);
            }
            this.elem.append(label);
        }
    }
    
    return WarDisplay;
});
