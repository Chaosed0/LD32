
define(['jquery', './Util', './UIElem'], function($, u, UIElem) {
    const goodWarColor = '#b00';
    const badWarColor = '#f00';
    const peaceColor = '#0f0';

    var ActionDisplay = function() {
        this.elem.css({
            'width': '250px',
            'height': '150px',
        });
        this.elem.setPos(20, $(window).height() - 20 - 150);
    }
    ActionDisplay.prototype = new UIElem();
    ActionDisplay.prototype.constructor = ActionDisplay;

    ActionDisplay.prototype.displayActions = function(continentStats, playerStats, onAction) {
        this.elem.empty();
        this.elem.append('<h1>Actions</h1>');
        var self = this;
        var agentsButton = $('<button type="button"/>');
        var squadButton = $('<button type="button"/>');

        if (continentStats.hasAgents) {
            agentsButton.text("Withdraw agents");
            agentsButton.click(function() {
                continentStats.hasAgents = false;
                playerStats.agents++;
                onAction();
            });
        } else if (playerStats.agents <= 0) {
            agentsButton.text("No agents");
            agentsButton.prop("disabled", true);
        } else {
            agentsButton.text("Send agents");
            agentsButton.click(function() {
                continentStats.hasAgents = true;
                playerStats.agents--;
                onAction();
            });
        }

        if (continentStats.hasSquad) {
            squadButton.text("Withdraw squadron");
            squadButton.click(function() {
                continentStats.hasSquad = false;
                playerStats.squad++;
                onAction();
            });
        } else if (playerStats.squads <= 0) {
            squadButton.text("No squadrons");
            squadButton.prop("disabled", true);
        } else {
            squadButton.text("Send squadron");
            squadButton.click(function() {
                continentStats.hasSquad = true;
                playerStats.squads--;
                onAction();
            });
        }
        
        this.elem.append(agentsButton);
        this.elem.append('<br/>');
        this.elem.append(squadButton);
    }

    return ActionDisplay;
});
