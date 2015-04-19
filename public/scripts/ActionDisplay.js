
define(['jquery', './Util'], function($, u) {
    const goodWarColor = '#b00';
    const badWarColor = '#f00';
    const peaceColor = '#0f0';

    var ActionDisplay = {};
    var elem = $('#actions');
    var actionCb = null;

    ActionDisplay.setActionCallback = function(cb) {
        actionCb = cb;
    }

    ActionDisplay.actionCallback = function() {
        if(actionCb !== null) {
            actionCb();
        }
    }

    ActionDisplay.displayActions = function(continentStats, playerStats) {
        elem.empty();
        elem.append('<h1>X-MOC HQ</h1>');
        elem.append($('<p/>').text('Agents: ' + playerStats.agents + ' | Squads: ' + playerStats.squads));

        if (continentStats === undefined) {
            return;
        }
        var self = this;
        var agentsButton = $('<button type="button" class="button"/>');
        var squadButton = $('<button type="button" class="button"/>');

        if (continentStats.hasAgent) {
            agentsButton.text("Withdraw Agent");
            agentsButton.click(function() {
                continentStats.hasAgent = false;
                playerStats.agents++;
                ActionDisplay.actionCallback();
            });
        } else if (playerStats.agents <= 0) {
            agentsButton.text("No agents");
            agentsButton.prop("disabled", true);
        } else {
            agentsButton.text("Deploy Agent");
            agentsButton.click(function() {
                continentStats.hasAgent = true;
                playerStats.agents--;
                ActionDisplay.actionCallback();
            });
        }

        if (continentStats.hasSquad) {
            squadButton.text("Withdraw Squadron");
            squadButton.click(function() {
                continentStats.hasSquad = false;
                playerStats.squads++;
                ActionDisplay.actionCallback();
            });
        } else if (playerStats.squads <= 0) {
            squadButton.text("No Squadrons");
            squadButton.prop("disabled", true);
        } else {
            squadButton.text("Deploy Squadron");
            squadButton.click(function() {
                continentStats.hasSquad = true;
                playerStats.squads--;
                ActionDisplay.actionCallback();
            });
        }
        
        elem.append(agentsButton);
        elem.append('<br/>');
        elem.append(squadButton);
    }

    return ActionDisplay;
});
