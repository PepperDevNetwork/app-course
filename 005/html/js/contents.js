// pepper contents

Tapper.contents = {

    onLoad: function(param) {
        console.log("onLoad.");
    },

    onStart: function(param) {
        console.log("onStart.");

        Tapper.utl.subscribeEvent("ComSoftbankrobotics/SampleProject/Tablet/ShowMessage", function (data) {
            $('.message').hide();
            $('#' + data).show();
        });
    },

    onPageSplash: function (param) {
        console.log("onPageSplash.");
    },

    onPageQuiz: function (param) {
        console.log("onPageQuiz.");
    }
}
