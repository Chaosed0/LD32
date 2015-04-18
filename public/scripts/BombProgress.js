
define(['jquery', './Util', './GameObj'], function($, u, GameObj) {

    const leftPadding = 290;
    const rightPadding = 290;

    var BombProgress = function(isMain) {
        var bombProgress = GameObj('<progress value="70" max="100"></progress>');
        var progressLabel = GameObj('<div>MIND CONTROL BOMB PROGRESS</div>');
        $('body').append(bombProgress);
        $('body').append(progressLabel);
        
        bombProgress.setPos(leftPadding, $(window).height() - 20 - 20);
        bombProgress.css({'width': $(window).width() - leftPadding - (isMain ? 20 : rightPadding),
                          'height': 20});
        if (isMain) {
            progressLabel.setPos(leftPadding, $(window).height() - 60);
        } else {
            progressLabel.setPos(leftPadding, $(window).height() + 60);
        }

        this.bombProgress = bombProgress;
        this.progressLabel = progressLabel;
    };

    return BombProgress;
});
