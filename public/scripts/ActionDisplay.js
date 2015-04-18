
define(['jquery', './Util', './UIElem'], function($, u, UIElem) {
    const goodWarColor = '#b00';
    const badWarColor = '#f00';
    const peaceColor = '#0f0';

    var ActionDisplay = function() {
        this.elem.css({
            'width': '250px',
            'height': '170px',
        });
        this.elem.setPos(20, $(window).height() - this.elem.height() - 20);
    }
    ActionDisplay.prototype = new UIElem();
    ActionDisplay.prototype.constructor = ActionDisplay;

    ActionDisplay.prototype.displayActions = function(continentStats, playerStats) {
        this.elem.empty();
        this.elem.append('<h1>X-MOC HQ</h1>');
        this.elem.append($('<p/>').text('Agents: ' + playerStats.agents + ' | Squads: ' + playerStats.squads));

        if (continentStats === undefined) {
            return;
        }
        var self = this;
        var agentsButton = $('<button type="button"/>');
        var squadButton = $('<button type="button"/>');

        if (continentStats.hasAgents) {
            agentsButton.text("Withdraw agents");
            agentsButton.click(function() {
                continentStats.hasAgents = false;
                playerStats.agents++;
                self.elem.trigger("Action");
            });
        } else if (playerStats.agents <= 0) {
            agentsButton.text("No agents");
            agentsButton.prop("disabled", true);
        } else {
            agentsButton.text("Deploy agents");
            agentsButton.click(function() {
                continentStats.hasAgents = true;
                playerStats.agents--;
                self.elem.trigger("Action");
            });
        }

        if (continentStats.hasSquad) {
            squadButton.text("Withdraw squadron");
            squadButton.click(function() {
                continentStats.hasSquad = false;
                playerStats.squads++;
                self.elem.trigger("Action");
            });
        } else if (playerStats.squads <= 0) {
            squadButton.text("No squadrons");
            squadButton.prop("disabled", true);
        } else {
            squadButton.text("Deploy squadron");
            squadButton.click(function() {
                continentStats.hasSquad = true;
                playerStats.squads--;
                self.elem.trigger("Action");
            });
        }
        
        this.elem.append(agentsButton);
        this.elem.append('<br/>');
        this.elem.append(squadButton);
    }

    return ActionDisplay;
});
