// pepper contents

Tapper.contents = {

    onLoad: function (param) {
        console.log("onLoad.");
        
    },

    onStart: function (param) {
        console.log("onStart.");

        if(!Tapper.proxy.ALServiceManager.isServiceRunning('SBRSpeechReco')){
            Tapper.proxy.ALServiceManager.start('SBRSpeechReco');
        }
        Tapper.proxy.SBRSpeechReco.start();
        Tapper.utl.subscribeEvent("ComSoftbankrobotics/SampleProject/SpeechRecognizer/Recognized", function (text) {
            $('#text').val(text);
        });
    },

    onPageSplash: function (param) {
    }
}
