/**
 * Audio utility
 */
Tapper.audio = {
    init: function () {
        Tapper.utl.getData('ComSoftbankrobotics/SampleProject/Tablet/AudioPath', function (data) {
            Tapper.audio.path = data;
        }, function (data) {
            // nop
        });
    },
    play: function (file) {
        current_file = Tapper.audio.path + file;
        Tapper.proxy.ALAudioPlayer.playFileFromPosition(current_file, 0, 0.8, 0);
    },
    stop: function () {
        Tapper.proxy.ALAudioPlayer.stopAll();
        Tapper.proxy.ALAudioPlayer.playFileFromPosition(current_file, 0, 1.0, 0);
    }
};