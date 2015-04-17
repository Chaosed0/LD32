
define(['crafty', 'jquery', './Util',
        './Shape',
        './Expires',
    ], function(Crafty, $, u) {

    var self = this;
    
    var width = $(document).width();
    var height = $(document).height();
    var gameElem = document.getElementById('game');

    Crafty.init(width, height, gameElem);  			  		
    Crafty.viewport.clampToEntities = false;

    Crafty.scene("Load", function() {

        console.log("LOAD");
        
        Crafty.background("#000");
        Crafty.e("2D, DOM, Text").attr({ w:width, h: 20, x: 0, y: height/2 })
                .text("Loading...")
                .css({ "text-align": "center" });

        var assets = { }
        
        //Preload assets first
        Crafty.load(assets, function() {
            Crafty.scene("Main");		
        });
    });

    Crafty.scene("Main", function () {
        console.log("MAIN");
        Crafty.background("#AAAAAA");
    });

    Crafty.scene("Load");
});
