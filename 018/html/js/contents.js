// pepper contents

Tapper.contents = {

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

    onPageVision: function (param) {
        console.log("onPageVision.");
        var event = Tapper.utl.subscribeEvent("ComSoftbankrobotics/SampleProject/Tablet/PreviewStop", function (id) {
            Tapper.preview.stop();
            event.unsubscribe();
            event2.unsubscribe();
        });

        var event2 = Tapper.utl.subscribeEvent("ComSoftbankrobotics/SampleProject/Tablet/Google/Vision/Response", function (json) {
            var data = JSON.parse(json);
            data = data['responses'][0]['labelAnnotations'];
            $('#text-vision-result').empty();
            for (var index in data) {
                $("#text-vision-result").append(data[index].score + ": " + data[index].description + "<br />");
            }
            $('#image-source').attr("src", "images/photo.jpg?aa=" + new Date());
            $('#filter').hide();
            node.removeClass('touched');
            node.removeClass('selected');
        });

        
        Tapper.preview.start();
        $(".frame").show();
    }
}
