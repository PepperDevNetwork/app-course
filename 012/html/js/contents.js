// pepper contents

Tapper.contents = {

    onLoad: function (param) {
        console.log("onLoad.");
        
    },

    onStart: function (param) {
        console.log("onStart.");
    },

    onPageSplash: function (param) {
    },

    onPageLearn: function (param) {
    },

    onPageThermometer: function (param) {
        Tapper.utl.subscribeEvent("ComSoftbankrobotics/SampleProject/IRemocon/Thermometer", function (value) {
            $('.message-remocon').html(value + "度");
        });
    }
}
