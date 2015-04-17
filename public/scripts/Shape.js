
define(['crafty'], function(Crafty) {

    var draw = function(e) {
        if(!e.type === "canvas") {
            e.destroy();
            console.log("Shape doesn't support anything other than canvas");
        }

        e.ctx.beginPath();

        var radius = Math.min(this._w, this._h)/2;
        if(this._sides < 7) {
            var angle = -Math.PI / 2;

            for(var i = 0; i < this._sides; i++) {
                var p = {x: this.x + this._w/2, y: this.y + this._h/2};
                p.x += Math.cos(angle) * radius;
                p.y += Math.sin(angle) * radius;

                if(i === 0) {
                    e.ctx.moveTo(p.x, p.y);
                } else {
                    e.ctx.lineTo(p.x, p.y);
                }

                angle += (2 * Math.PI / this._sides);
            }
        } else {
            /* Okay , technically a circle is a regular polygon with infinite sides,
             * but just bear with me */
            e.ctx.arc(this.x + this.w/2, this.y + this.h/2, radius, 0, 2 * Math.PI);
        }

        e.ctx.closePath();

        if (this._fillcolor) {
            e.ctx.fillStyle = this._fillcolor;
            e.ctx.fill();
        }

        if (this._strokecolor) {
            e.ctx.strokeStyle = this._strokecolor;
            e.ctx.lineWidth = 5;
            e.ctx.stroke();
        }
    }

    var shapeDimensions = {
        3: 3.5,
        4: 2,
        5: 2,
        6: 2,
        7: 1.5,
    };

    Crafty.c("Shape", {
        _sides: null,
        _strokecolor: '#000000',
        _fillcolor: null,
        ready: false,

        init: function() {
            this.ready = true;
            this.bind("Draw", draw);
            this.trigger("Invalidate");
        },

        remove: function() {
            this.trigger("Invalidate");
            this.unbind("Draw", draw);
        },

        sides: function(sides) {
            if (sides === undefined) {
                return this._sides;
            } else {
                this._sides = sides;
                this.trigger("Invalidate");
                return this;
            }
        },

        strokecolor: function(color) {
            if (color === undefined) {
                return this._strokecolor;
            } else {
                this._strokecolor = color;
                this.trigger("Invalidate");
                return this;
            }
        },

        fillcolor: function(color) {
            if (color === undefined) {
                return this._fillcolor;
            } else {
                this._fillcolor = color;
                this.trigger("Invalidate");
                return this;
            }
        },

        enclose: function(width, height) {
            var size = shapeDimensions[Math.min(this._sides, 7)];
            var length = Math.max(width, height);
            this.w = length * size;
            this.h = length * size;
            this.x = width / 2 - this.w/2;
            this.y = height / 2 - this.h/2;

            return this;
        }
    });
});
