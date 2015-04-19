
define(['jquery', './Util', './GameObj'], function($, u, GameObj) {

    const padding = 100;

    var Arc = function(p1, p2) {
        this.canvas = GameObj('<canvas class="arc"></canvas>');

        var position = { x: Math.min(p1.x, p2.x), y: Math.min(p1.y, p2.y) };
        var size = { w: Math.abs(p2.x - p1.x), h: Math.abs(p2.y - p1.y) };
        this.position = position;
        this.size = size;

        var midpoint = { x: position.x + size.w/2, y: position.y + size.h/2 };
        var normalSlope = { x: p1.y - p2.y, y: p2.x - p1.x };
        var magnitude = Math.sqrt(normalSlope.x*normalSlope.x + normalSlope.y*normalSlope.y);
        normalSlope.x /= magnitude;
        normalSlope.y /= magnitude;
        var cp = { x: midpoint.x + normalSlope.x * 100, y: midpoint.y + normalSlope.y * 100 };

        this.canvas.setPos(Math.floor(position.x - padding), Math.floor(position.y - padding));
        this.canvas[0].width = Math.floor(size.w + padding * 2);
        this.canvas[0].height = Math.floor(size.h + padding * 2);

        var ctx = this.canvas[0].getContext('2d');
        ctx.beginPath();
        ctx.strokeStyle = '#c00';
        ctx.lineWidth = 3;

        var tp1 = this.transformPoint(p1);
        var tp2 = this.transformPoint(p2);
        var tcp = this.transformPoint(cp);
        ctx.moveTo(tp1.x, tp1.y);
        /*ctx.lineTo(tcp.x, tcp.y);
        ctx.lineTo(tp2.x, tp2.y);*/
        ctx.bezierCurveTo(Math.floor(tcp.x), Math.floor(tcp.y),
                Math.floor(tcp.x), Math.floor(tcp.y),
                Math.floor(tp2.x), Math.floor(tp2.y));
        ctx.stroke();

        $('#map_container').append(this.canvas);
    }

    Arc.prototype.transformPoint = function(point) {
        return {x: Math.floor(point.x + padding - this.position.x),
                y: Math.floor(point.y + padding - this.position.y)};
    }

    return Arc;
});
