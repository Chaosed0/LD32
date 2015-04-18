
define(['jquery', './Util', './GameObj'], function($, u, GameObj) {

    const leftPadding = 290;
    const rightPadding = 200;

    var BombProgress = function(isMain, progress, continent) {
        var bombProgress = GameObj('<progress value="70" max="100"></progress>');
        var progressLabel = GameObj('<div>');
        var progressText = 'MIND CONTROL BOMB PROGRESS';
        if (!isMain) {
            u.assert(continent !== undefined);
            progressText = continent.toUpperCase() + '\'S ' + progressText;
        }
        progressLabel.text(progressText);
        $('body').append(bombProgress);
        $('body').append(progressLabel);
        
        bombProgress.css({'width': $(window).width() - leftPadding - rightPadding,
                          'height': 20});
        if (isMain) {
            bombProgress.setPos(leftPadding, $(window).height() - bombProgress.height() - 20);
            progressLabel.setPos(leftPadding, $(window).height() - 60);
        } else {
            bombProgress.setPos(leftPadding, 20);
            progressLabel.setPos(leftPadding, 40);
        }

        this.bombProgress = bombProgress;
        this.progressLabel = progressLabel;

        this.setProgress(progress);
    };

    BombProgress.prototype.destroy = function() {
        this.bombProgress.remove();
        this.progressLabel.remove();
    }

    BombProgress.prototype.setProgress = function(progress) {
        this.bombProgress.val(progress);
    }

    return BombProgress;
});
