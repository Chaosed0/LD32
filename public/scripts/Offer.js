
define(['jquery', './Util'], function($, u) {
    var Offer = function(continentStats, playerStats) {
        this.offeringContinent = null;
        this.offendingContinent = null;
        this.removeAgent = false;
        this.removeSquads = false;
        this.duration = 0;
        this.scienceToReceive = 0;
        
        this.giveAgent = false;
        this.giveSquad = false;
        this.scienceToGive = 0;

        this.isValid = false;

        this.continentStats = continentStats;
        this.playerStats = playerStats;
    }

    /* Checks if the offer can still be fulfilled, e.g. if the player didn't
     * withdraw an agent/squad but the offer included an agent/squad.
     * Decided to take another approach, but keeping this around just in case */
    Offer.prototype.stillValid = function() {
        if (this.removeAgent && !this.continentStats[this.offendingContinent].hasAgent) {
            return 'Agent was withdrawn';
        } else if (this.removeSquads && !this.continentStats[this.offendingContinent].squads > 0) {
            return 'Squads were withdrawn';
        } else if (this.playerStats.science < this.scienceToReceive) {
            return 'Not enough scientists';
        }
        return true;
    }

    Offer.prototype.randomAgentOffer = function(offering, offending) {
        this.offeringContinent = offering;
        this.offendingContinent = offending;
        this.removeAgent = true;

        /* We can either offer a squad or a scientist */
        var random = Math.random();
        var scienceOffering = this.duration;
        /* If we should offer a squad, or if we don't have enough science to give up, offer a squad */
        if (random <= 0.5) {
            this.giveSquad = true;
            this.duration = Math.floor(u.getRandom(1, 3));
        } else {
            this.duration = Math.floor(u.getRandom(1, 6));
            this.scienceToGive = this.duration;
        }
    }

    Offer.prototype.randomSquadOffer = function(offering, offending) {
        this.offeringContinent = offering;
        this.offendingContinent = offending;
        this.removeSquads = true;

        /* We can either offer a squad or a scientist */
        var random = Math.random();
        var removedSquads = this.continentStats[offending].squads;
        if (random <= 0.5) {
            this.giveSquad = true;
            this.duration = Math.max(1, 4 - removedSquads);
        } else {
            this.duration = Math.floor(u.getRandom(1, 6));
            this.scienceToGive = Math.max(0, Math.floor(this.duration / 2)) + removedSquads;
        }
    }

    Offer.prototype.randomScienceOffer = function(offerer) {
        this.offeringContinent = offerer;
        this.scienceToReceive = Math.floor(u.getRandom(1, (this.playerStats.science/2)));

        /* Start offering agents at a high enough science */
        if (this.scienceToReceive <= Math.ceil(this.playerStats.science/4)) {
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
                            (type == 1 && this.continentStats[i].squads > 0)) {
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
                stats.agentBlockedDuration = this.duration;
                /* You might look at this and ask "what if the player didn't
                 * have an agent on the continent?" We can be fairly sure they
                 * had one on the continent at the time the offer was made, so
                 * if they don't have one there now, they're probably withdrawn
                 * it themselves already. We'll still block further agents. */
                if (stats.hasAgent) {
                    stats.hasAgent = false;
                    this.playerStats.agents++;
                }
            }
            if (this.removeSquads) {
                stats.squadBlockedDuration = this.duration;
                /* Ditto */
                if (stats.squads > 0) {
                    this.playerStats.squads += stats.squads;
                    stats.squads = 0;
                }
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
        /* Continents can produce scientists out of thin air */
        this.playerStats.science += this.scienceToGive;
    }

    return Offer;
});
