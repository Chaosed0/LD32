
define(['jquery', './Util'], function($, u) {
    var GameObj = function(selector) {
        var obj = $(selector);
        obj.position = {x: 0, y: 0};
        obj.css('position', 'absolute');
        obj.css('width', 'auto');
        obj.css('height', 'auto');

        obj.setPos = function(x, y) {
            var pos;
            if (y === undefined) {
                pos = x;
            } else {
                pos = {x: x, y: y};
            }

            u.assert(pos.x !== undefined && pos.y !== undefined);

            this.css('left', pos.x);
            this.css('top', pos.y);
            this.position = pos;
        }

        return obj;
    }

    return GameObj;
});
