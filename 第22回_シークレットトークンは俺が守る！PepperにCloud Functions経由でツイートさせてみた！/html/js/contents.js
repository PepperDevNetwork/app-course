// pepper contents

Tapper.contents = {
    isRunning: false,
    onLoad: function (param) {
        console.log("onLoad.");
    },

    onStart: function (param) {
        console.log("onStart.");
        Tapper.preview.init({ id: "preview" });
    },

    onPageSplash: function (param) {
        console.log("onPageSplash.");

    },
    onPageWaiting: function (param) {
        console.log("onPageWating.");

    },
    onPagePreview: function (param) {
        console.log("onPagePreview.");
        if (!Tapper.contents.isRunning) {
            Tapper.contents.isRunning = true;
            Tapper.preview.start();
        }
    },
    onPageHashTag: function (param) {
        console.log("onPageHashTag.");

    }
}
