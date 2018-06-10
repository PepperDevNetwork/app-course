(function ($) {

    var Viewer = function(){
        var self = this;

        var EVENT_TOUCH_START = "touchstart", EVENT_TOUCH_END = "touchend";
//        var EVENT_TOUCH_START = "mouseover", EVENT_TOUCH_END = "mouseout";


        // ページ表示
        $.subscribeToALMemoryEvent("ComSoftbankrobotics/SampleProject/Tablet/ShowPage", function (page_id) {
            self.hideMessage();
            $('#filter').hide();
            self.showPage(page_id);

        });


        // メッセージ表示
        $.subscribeToALMemoryEvent("ComSoftbankrobotics/SampleProject/Tablet/ShowMessage", function (message_id) {
            self.showMessage(message_id);
        });

        // ボタン制御
        $(document).on(EVENT_TOUCH_START, '[data-btn-id]', function(){
            if(!$(this).hasClass("disabled")){
                var url = $(this).css('background-image').replace('_off.png', '_on.png');
                $(this).css('background-image', url);
                $(this).addClass('touched');
            }
        }).on(EVENT_TOUCH_END, '[data-btn-id]', function(){
            if (!$(this).hasClass("disabled")) {
                $('#filter').show();
                var url = $(this).css('background-image').replace('_on.png', '_off.png');
                $(this).css('background-image', url);
                $(this).removeClass('touched');
                $(this).closest('.btn-group').find('.btn').removeClass('selected');
                $(this).addClass('selected');
                $.audio.play('se_button_touched.ogg');
                $.raiseALMemoryEvent("ComSoftbankrobotics/SampleProject/Tablet/ButtonTouched", $(this).attr('data-btn-id'));
            }
        });

        // 音声認識などでボタンを制御
        $.subscribeToALMemoryEvent("ComSoftbankrobotics/SampleProject/Tablet/ButtonTouch", function (button_id) {
            $('.btn[data-btn-id="' + button_id + '"]').trigger(EVENT_TOUCH_START).trigger(EVENT_TOUCH_END);
        });

        // 画像のプリロード
        $.getALMemoryData("ComSoftbankrobotics/SampleProject/Tablet/ImagePreload", function (list) {
            var images = list.split(';');
            for (var index in images) {
                $('<img>').attr('src', 'images/' + images[index]);
            }

            $.raiseALMemoryEvent("ComSoftbankrobotics/SampleProject/Tablet/Initialized", "1");
        });

    };

    Viewer.prototype.showPage = function(page_id){
        $('.page').hide();
        $('.message').hide();
        $('#filter').hide();
        $('#' + page_id).show();
        this.update(page_id);
    };

    Viewer.prototype.showMessage = function(message_id){
        $('.message').hide();
        $('#' + message_id).show();
    };

    Viewer.prototype.hideMessage = function(){
        $('.message').hide();
    };

    Viewer.prototype.updateHeader = function(page_id){
    };


    $.viewer = new Viewer();

})(jQuery);
