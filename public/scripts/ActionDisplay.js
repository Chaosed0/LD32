
define(['jquery', './Util'], function($, u) {
    const goodWarColor = '#b00';
    const badWarColor = '#f00';
    const peaceColor = '#0f0';

    var ActionDisplay = {};
    var elem = $('#actions');

    ActionDisplay.displayActions = function(continentStats, playerStats) {
        elem.empty();
        elem.append('<h1>S-COM HQ</h1>');
        var resourcesText = 'Agents: ' + playerStats.agents + ' | Squads: ' + playerStats.squads + ' | Scientists: ' + playerStats.science;

        elem.append($('<p/>').text(resourcesText).css({'font-size': '12px', 'margin-bottom': '3px'}));

        if (continentStats === undefined) {
            return;
        }
        var self = this;
        var agentsButton = $('<button type="button" class="button"/>');
        var squadButton = $('<button type="button" class="button"/>');
        var withdrawButton = $('<button type="button" class="button"/>');
        var scientistsButton = $('<button type="button" class="button"/>');
        var withdrawScienceButton = $('<button type="button" class="button"/>');

        if (continentStats.agentBlockedDuration > 0) {
            agentsButton.text("Agents blocked (" + continentStats.agentBlockedDuration + ")");
            agentsButton.prop("disabled", true);
        } else if (continentStats.hasAgent) {
            agentsButton.text("Withdraw Agent");
            agentsButton.click(function() {
                continentStats.hasAgent = false;
                playerStats.agents++;
                $(window).trigger("ActionTaken");
            });
        } else if (playerStats.agents <= 0) {
            agentsButton.text("No agents");
            agentsButton.prop("disabled", true);
        } else {
            agentsButton.text("Deploy Agent");
            agentsButton.click(function() {
                continentStats.hasAgent = true;
                playerStats.agents--;
                $(window).trigger("ActionTaken");
            });
        }

        if (continentStats.squads > 0) {
            withdrawButton.show();
            withdrawButton.text("Withdraw Squad");
            withdrawButton.click(function() {
                continentStats.squads--;
                playerStats.squads++;
                $(window).trigger("ActionTaken");
            });
        } else {
            withdrawButton.hide();
        }

        if (continentStats.squadBlockedDuration > 0) {
            squadButton.text("Squads blocked (" + continentStats.squadBlockedDuration + ")");
            squadButton.prop("disabled", true);
        } else if (playerStats.squads <= 0) {
            squadButton.text("No Squads");
            squadButton.prop("disabled", true);
        } else {
            squadButton.text("Deploy Squad");
            squadButton.click(function() {
                continentStats.squads++;
                playerStats.squads--;
                $(window).trigger("ActionTaken");
            });
        }

        if (continentStats.addlScience > 0) {
            withdrawScienceButton.show();
            withdrawScienceButton.text("Withdraw Scientist");
            withdrawScienceButton.click(function() {
                continentStats.addlScience--;
                playerStats.science++;
                $(window).trigger("ActionTaken");
            });
        } else {
            withdrawScienceButton.hide();
        }

        if (playerStats.science <= 0) {
            scientistsButton.text("No Scientists");
            scientistsButton.prop("disabled", true);
        } else {
            scientistsButton.text("Send Scientist");
            scientistsButton.click(function() {
                continentStats.addlScience++;
                playerStats.science--;
                $(window).trigger("ActionTaken");
            });
        }
        
        elem.append($('<div/>').append(agentsButton));
        elem.append($('<div/>').append(squadButton).append(withdrawButton));
        elem.append($('<div/>').append(scientistsButton).append(withdrawScienceButton));
    }

    return ActionDisplay;
});
