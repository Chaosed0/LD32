
define(['jquery', './Util', './GameObj'], function($, u, GameObj) {
    var UIElem = function() {
        var elem = GameObj('<div class="container"/>');

        $('body').append(elem);

        this.elem = elem;
        this.visible(false);
    }

    UIElem.prototype.visible = function(isVisible) {
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
    
    return UIElem;
});
