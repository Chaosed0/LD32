
define(['jquery', './Util'], function($, u) {
    var Offer = function() {
        this.offeringContinent = null;
        this.offendingContinent = null;
        this.removeAgent = false;
        this.removeSquad = false;
        this.duration = 0;
        this.scienceToReceive = 0;
        
        this.giveAgent = false;
        this.giveSquad = false;
        this.scienceToGive = 0;
    }

    Offer.prototype.randomAgentOffer = function(continentStats, offering, offending) {
        this.offeringContinent = offering;
        this.offendingContinent = offending;
        this.removeAgent = true;
        this.duration = Math.floor(u.getRandom(2, 6));

        /* We can either offer a squad or a scientist */
        var offerSquad = Math.round(Math.random());
        if (offerSquad == 1 && this.duration <= 3) {
            this.giveSquad = true;
        } else {
            this.scienceToGive = this.duration;
        }
    }

    Offer.prototype.randomSquadOffer = function(continentStats, offering, offending) {
        this.offeringContinent = offering;
        this.offendingContinent = offending;
        this.removeSquad = true;
        this.duration = Math.floor(u.getRandom(1, 6));

        /* We can either offer a squad or a scientist */
        var offerSquad = Math.round(Math.random());
        if (offerSquad == 1 && duration >= 3) {
            this.giveSquad = true;
        } else {
            this.scienceToGive = Math.floor(this.duration / 2);
        }
    }

    Offer.prototype.randomScienceOffer = function(continentStats, playerStats, offerer) {
        this.offeringContinent = offerer;
        this.scienceToReceive = Math.floor(u.getRandom(1, playerStats.science));

        /* Start offering agents at a high enough science */
        if (this.scienceToReceive <= Math.ceil(playerStats.science/2)) {
            this.giveSquad = true;
        } else {
            this.giveAgent = true;
        }
    }

    Offer.prototype.makeRandom = function(continentStats, playerStats) {
        var madeOffer = false;
        var invalidOffer = [false, false, false];
        while (!madeOffer) {
            var type = Math.floor(u.getRandom(0, 3));
            /* Did we already try to make this offer? */
            if (invalidOffer[type] == true) {
                continue;
            }

            if (type == 0 || type == 1) {
                /* Remove squad or agent from offending nation */
                /* First, figure out which continents have agents on them */
                var validOffenders = [];
                for (var i = 0; i < continentStats.length; i++) {
                    if ((type == 0 && continentStats[i].hasAgent) ||
                            (type == 1 && continentStats[i].hasSquad)) {
                        validOffenders.push(i);
                    }
                }

                u.shuffleArray(validOffenders);
                for (var i = 0; i < validOffenders.length; i++) {
                    /* Find someone at war with the offender */
                    var validOfferers = continentStats[validOffenders[i]].getWars();
                    if (validOfferers.length > 0) {
                        var offerer = u.randomElem(validOfferers);
                        var offender = validOffenders[i];
                        if (type == 0) {
                            this.randomAgentOffer(continentStats, offerer, offender);
                        } else {
                            this.randomSquadOffer(continentStats, offerer, offender);
                        }
                        madeOffer = true;
                    }
                }
            } else {
                /* Receive scientists for squad or agent; any nation can do this */
                var offerer = Math.floor(u.getRandom(continentStats.length));
                this.randomScienceOffer(continentStats, playerStats, offerer);
                madeOffer = true;
            }

            invalidOffer[type] = !madeOffer;
        }
    }

    Offer.prototype.accept = function(continentStats, playerStats) {
        if (this.offendingContinent !== null) {
            var stats = continentStats[this.offendingContinent];
            if (this.removeAgent) {
                u.assert(stats.hasAgent === true);
                stats.hasAgent = false;
                stats.agentBlockedDuration = this.duration;
                playerStats.agents++;
            }
            if (this.removeSquad) {
                u.assert(stats.hasSquad === true);
                stats.hasSquad = false;
                stats.squadBlockedDuration = this.duration;
                playerStats.squads++;
            }
        }
        continentStats[this.offeringContinent].science += this.scienceToReceive;
        playerStats.science -= this.scienceToReceive;

        if (this.giveAgent) {
            playerStats.agents++;
        }
        if (this.giveSquad) {
            playerStats.squads++;
        }
        playerStats.science += this.scienceToGive;
    }

    return Offer;
});
