
define(['jquery', './Util'], function($, u) {
    var Offer = function(continentStats, playerStats) {
        this.offeringContinent = null;
        this.offendingContinent = null;
        this.removeAgent = false;
        this.removeSquad = false;
        this.duration = 0;
        this.scienceToReceive = 0;
        
        this.giveAgent = false;
        this.giveSquad = false;
        this.scienceToGive = 0;

        this.isValid = false;

        this.continentStats = continentStats;
        this.playerStats = playerStats;
    }

    /* Checks if the offer can still be fulfilled, e.g. if the
     * player didn't withdraw an agent/squad but the offer
     * included an agent/squad. */
    Offer.prototype.stillValid = function() {
        if (this.removeAgent && !this.continentStats[this.offendingContinent].hasAgent) {
            return 'Agent was withdrawn';
        } else if (this.removeSquad && !this.continentStats[this.offendingContinent].hasSquad) {
            return 'Squad was withdrawn';
        } else if (this.playerStats.science < this.scienceToReceive) {
            return 'Not enough scientists';
        }
        return true;
    }

    Offer.prototype.randomAgentOffer = function(offering, offending) {
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

    Offer.prototype.randomSquadOffer = function(offering, offending) {
        this.offeringContinent = offering;
        this.offendingContinent = offending;
        this.removeSquad = true;
        this.duration = Math.floor(u.getRandom(1, 6));

        /* We can either offer a squad or a scientist */
        var offerSquad = Math.round(Math.random());
        if (offerSquad == 1 && this.duration >= 3) {
            this.giveSquad = true;
        } else {
            /* Offer at least one scientist */
            this.scienceToGive = Math.max(Math.floor(this.duration / 2), 1);
        }
    }

    Offer.prototype.randomScienceOffer = function(offerer) {
        this.offeringContinent = offerer;
        this.scienceToReceive = Math.floor(u.getRandom(1, this.playerStats.science));

        /* Start offering agents at a high enough science */
        if (this.scienceToReceive <= Math.ceil(this.playerStats.science/2)) {
            this.giveSquad = true;
        } else {
            this.giveAgent = true;
        }
    }

    Offer.prototype.makeRandom = function() {
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
                for (var i = 0; i < this.continentStats.length; i++) {
                    if ((type == 0 && this.continentStats[i].hasAgent) ||
                            (type == 1 && this.continentStats[i].hasSquad)) {
                        validOffenders.push(i);
                    }
                }

                u.shuffleArray(validOffenders);
                for (var i = 0; i < validOffenders.length; i++) {
                    /* Find someone at war with the offender */
                    var validOfferers = this.continentStats[validOffenders[i]].getWars();
                    if (validOfferers.length > 0) {
                        var offerer = u.randomElem(validOfferers);
                        var offender = validOffenders[i];
                        if (type == 0) {
                            this.randomAgentOffer(offerer, offender);
                        } else {
                            this.randomSquadOffer(offerer, offender);
                        }
                        madeOffer = true;
                    }
                }
            } else {
                /* Receive scientists for squad or agent; any nation can do this */
                if (this.playerStats.science > 0) {
                    var offerer = Math.floor(u.getRandom(this.continentStats.length));
                    this.randomScienceOffer(offerer);
                    madeOffer = true;
                }
            }

            invalidOffer[type] = !madeOffer;

            if (invalidOffer.indexOf(false) == -1) {
                /* No offers could be made */
                return;
            }
        }
        this.isValid = true;
    }

    Offer.prototype.accept = function() {
        if (this.offendingContinent !== null) {
            var stats = this.continentStats[this.offendingContinent];
            if (this.removeAgent) {
                u.assert(stats.hasAgent === true);
                stats.hasAgent = false;
                stats.agentBlockedDuration = this.duration;
                this.playerStats.agents++;
            }
            if (this.removeSquad) {
                u.assert(stats.hasSquad === true);
                stats.hasSquad = false;
                stats.squadBlockedDuration = this.duration;
                this.playerStats.squads++;
            }
        }
        this.continentStats[this.offeringContinent].science += this.scienceToReceive;
        this.playerStats.science -= this.scienceToReceive;

        if (this.giveAgent) {
            this.playerStats.agents++;
        }
        if (this.giveSquad) {
            this.playerStats.squads++;
        }
        this.playerStats.science += this.scienceToGive;
    }

    return Offer;
});
