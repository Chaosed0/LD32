
define(['jquery', './Util', './Constants'], function($, u, c) {

    var ContinentStats = function() {
        this.strength = Math.floor(u.getRandom(0, 10));
        this.stability = Math.floor(u.getRandom(40, ContinentStats.maxStability));
        this.science = Math.floor(u.getRandom(3, 6));
        this.progress = 0;
        this.hasAgent = false;
        this.squads = 0;
        this.agentBlockedDuration = 0;
        this.squadBlockedDuration = 0;
        this.wars = [];
        this.conqueror = null;
    }

    ContinentStats.squadStrength = 5;
    ContinentStats.maxStability = 50;

    ContinentStats.prototype.getEffectiveStrength = function() {
        return this.strength + this.squads * ContinentStats.squadStrength;
    }

    ContinentStats.prototype.isAtWar = function() {
        var atWar = false;
        for (var i = 0; !atWar && i < this.wars.length; i++) {
            atWar = atWar || this.wars[i];
        }
        return atWar;
    }

    ContinentStats.prototype.getWars = function() {
        var wars = [];
        for (var i = 0; i < this.wars.length; i++) {
            if (this.wars[i] == true) {
                wars.push(i);
            }
        }
        return wars;
    }

    return ContinentStats;
});
