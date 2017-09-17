// pepper contents

Tapper.contents = {

    onLoad: function (param) {
        console.log("onLoad.");
    },

    onStart: function (param) {
        console.log("onStart.");
    },

    onPageSplash: function (param) {
        console.log("onPageSplash.");
    },

    onPageWord: function (param) {
        console.log("onPageWord.");

        Tapper.utl.subscribeEvent("ComSoftbankrobotics/SampleProject/Tablet/Recognizing", function () {
            $('#recognize-status').html("解析中...");
        });

        Tapper.utl.subscribeEvent("ComSoftbankrobotics/SampleProject/Tablet/ShowMessage", function (data) {
            $('#recognize-status').html("翻訳中...");
            $('#recognize-text').html("<div>" + data + "</div>");
        });

        Tapper.utl.subscribeEvent("ComSoftbankrobotics/SampleProject/Tablet/ShowTranslate", function (data) {
            $('#recognize-status').html("録音中...");
            $('#translate-text').html("<div>" + data + "</div>");
        });

        
    }
}
