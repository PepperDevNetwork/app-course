// pepper contents

Tapper.contents = {

    onLoad: function (param) {
        console.log("onLoad.");
        
    },

    onStart: function (param) {
        console.log("onStart.");

        if(!Tapper.proxy.ALServiceManager.isServiceRunning('SBRTranslateTextToSpeech')){
            Tapper.proxy.ALServiceManager.start('SBRTranslateTextToSpeech');
        }

        $('#submit').click(function () {
            var text = $('#text').val();
            if (text) {
                Tapper.proxy.SBRTranslateTextToSpeech.speech(text);
            }
        });
    },

    onPageSplash: function (param) {
    }
}
