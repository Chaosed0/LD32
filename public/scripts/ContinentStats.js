
define(['jquery', './Util'], function($, u) {

    var ContinentStats = function() {
        this.strength = Math.floor(u.getRandom(0, 10));
        this.stability = Math.floor(u.getRandom(90, 100));
        this.science = Math.floor(u.getRandom(3, 7));
        this.progress = 0;
        this.hasAgents = false;
        this.hasSquad = false;
        this.wars = [];
    }

    ContinentStats.squadStrength = 5;

    ContinentStats.prototype.getEffectiveStrength = function() {
        return this.strength + this.hasSquad * ContinentStats.squadStrength;
    }

    return ContinentStats;
});
