// pepper contents

Tapper.contents = {
    isRunning: false,
    onLoad: function (param) {
        console.log("onLoad.");
    },

    onStart: function (param) {
        console.log("onStart.");
    },

    onPageSplash: function (param) {
        console.log("onPageSplash.");

    },
    onPageWaiting: function (param) {
        console.log("onPageWating.");
        Tapper.utl.subscribeEvent("ComSoftbankrobotics/SampleProject/NaturalLanguage/text", function (text) {
            $('#text').prepend(text);
            $('#text').prepend("<br />");
        });
        Tapper.utl.subscribeEvent("ComSoftbankrobotics/SampleProject/NaturalLanguage/score", function (text) {
            $('#text').prepend('<span style="color: #f00">' + text + '</span>');
            $('#text').prepend("<br />");
        });

    },
    onPageHashTag: function (param) {
        console.log("onPageHashTag.");

    }
}
