
define(['jquery', './Util', './GameObj'], function($, u, GameObj) {

    const leftPadding = 290;
    const rightPadding = 200;

    var BombProgress = function(isMain, progress, continent) {
        var bombProgress = GameObj('<progress value="70" max="100"></progress>');
        var progressLabel = GameObj('<div class="text-container"/>');
        var progressText = 'MIND CONTROL BOMB PROGRESS';
        if (!isMain) {
            u.assert(continent !== undefined);
            progressText = continent.toUpperCase() + '\'S ' + progressText;
        }
        progressLabel.text(progressText);
        var valueLabel = GameObj('<div class="text-container"/>');

        $('#map_container').append(bombProgress);
        $('#map_container').append(progressLabel);
        $('#map_container').append(valueLabel);
        
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
        this.valueLabel = valueLabel;
        this.isMain = isMain;

        this.setProgress(progress);
    };

    BombProgress.prototype.destroy = function() {
        this.bombProgress.remove();
        this.progressLabel.remove();
        this.valueLabel.remove();
    }

    BombProgress.prototype.setProgress = function(progress) {
        this.bombProgress.val(progress);
        this.valueLabel.text(progress + '%');
        this.valueLabel.setPos(this.bombProgress.position.x + this.bombProgress.width() - this.valueLabel.width(),
                this.progressLabel.position.y);
    }

    return BombProgress;
});
