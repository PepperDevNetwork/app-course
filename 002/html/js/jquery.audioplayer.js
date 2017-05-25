(function ($) {

    var SoundPlayer = function(){
        var self = this;
        this.app_path = "";
        this.current_file = "";
        this.player = null;

        $.getALMemoryData("ComSoftbankrobotics/SampleProject/Tablet/AudioPath", function (app_path) {
            self.app_path = app_path;
        });
        $.getService("ALAudioPlayer", function (ALAudioPlayer) {
            self.player = ALAudioPlayer;
        });

    };

    SoundPlayer.prototype.play = function(file_name){
        if(this.player){
            this.current_file = this.app_path  + file_name;
            this.player.playFileFromPosition(this.current_file, 0, 0.8, 0);
        }
    };

    SoundPlayer.prototype.stop = function(){
        if(player){
            this.player.stopAll();
            this.player.playFileFromPosition(current_file, 0, 1.0, 0);
        }
    };

    $.audio = new SoundPlayer();
})(jQuery);
