// pepper contents

Tapper.contents = {

    onLoad: function(param) {
        console.log("onLoad.");
    },

    onStart: function(param) {
        console.log("onStart.");
        Tapper.preview.init({ width: 640, height: 480, id: "preview" });
    },

    onPageSplash: function (param) {
        console.log("onPageSplash.");
    },

    onPageQR: function (param) {
        console.log("onPageQR.");
        var event = Tapper.utl.subscribeEvent("ComSoftbankrobotics/SampleProject/Tablet/PreviewStop", function (id) {
            Tapper.preview.stop();
            event.unsubscribe();
        });
        Tapper.preview.start();
    }
}
