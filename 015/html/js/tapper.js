// This script is Automatic generation by tapper

// Settings
var Tapper_Debug = false;
var Tapper_Debug_Host = "pepper.local";
var PROXY = ['ALMemory', 'ALAudioPlayer'];

var Tapper = Tapper || {}
Tapper.session = null;
Tapper.proxy = {}

/**
 * Core
 */
Tapper.core = function ($) {

    // image preload
    var _preload_img = function () {
        Tapper.utl.getData('ComSoftbankrobotics/SampleProject/Tablet/ImagePreload', function (data) {
            var images = data.split(';');
            $.each(images, function (i, src) {
                console.log($('<img>').attr('src', 'images/preloads/' + src));
            });
            Tapper.utl.raiseEvent("ComSoftbankrobotics/SampleProject/Tablet/Initialized", 1);
            Tapper.view.changeScene('{"id":"PageSplash"}');
        }, function (data) {
            Tapper.utl.raiseEvent("ComSoftbankrobotics/SampleProject/Tablet/Initialized", 1);
            Tapper.view.changeScene('{"id":"PageSplash"}');
        });
    };


    // connect alproxy.
    var _connect = function (callback) {
        var proxy_num = PROXY.length;

        var get_service = function (name) {
            Tapper.session.service(name).then(
                // onSuccess.
                function (proxy) {
                    Tapper.proxy[name] = proxy;
                    proxy_num--;
                    if (proxy_num <= 0) callback();
                },
                // onFailed.
                function (error) {
                    console.error(error);
                    result_func();
                }
            );
        };

        QiSession(function (session) {
            Tapper.session = session;

            for (index in PROXY) {
                get_service(PROXY[index]);
            }

        }, null, Tapper_Debug ? Tapper_Debug_Host : null);
    };

    var _bind = function () {
        // bind events.
        Tapper.utl.subscribeEvent("Tapper/View/ChangeScene", function (id) {
            Tapper.view.changeScene(id);
        });

        Tapper.utl.subscribeEvent("Tapper/View/ButtonSelect", function (id) {
            Tapper.view.buttonSelect(id);
        });
    };

    var _self = {
        init: function () {
            Tapper.view.init();
            Tapper.contents.onLoad();

            _connect(function () {
                _bind();
                Tapper.utl.getData("Tapper/InitData", function (data) {
                    Tapper.init_data = JSON.parse(data);
                    Tapper.contents.onStart();
                }, Tapper.contents.onStart);
                _preload_img();
                Tapper.audio.init();
            });
        }
    };
    return _self;
}(jQuery);


/**
 * Common utility
 */
Tapper.utl = {
    raiseEvent: function (name, val) {
        Tapper.proxy.ALMemory.raiseEvent(name, val);
    },
    subscribeEvent: function (name, func) {
        var evt = new EventSubscription(name);
        Tapper.proxy.ALMemory.subscriber(name).then(function (sub) {
            evt.setSubscriber(sub);
            sub.signal.connect(func).then(function (id) {
                evt.setId(id);
            });
        });
        return evt;
    },
    getData: function (name, succeeded, failed) {
        Tapper.proxy.ALMemory.getData(name).then(succeeded, failed);
    }
};


/**
 * View utility
 */
Tapper.view = {
    init: function () {
        $(document).on('touchstart', '[data-btn-id]', function () {
            var node = $(this);
            node.addClass('touched');
        }).on('touchend', '[data-btn-id]', function () {
            $('#filter').show();
            var node = $(this);
            node.removeClass('touched');
            node.addClass('selected');
            Tapper.audio.play("se_btn_touched.ogg");
            Tapper.utl.raiseEvent("Tapper/View/ButtonTouched", node.attr('data-btn-id'));
        });
    },
    changeScene: function (request) {
        try {
            $('#filter').hide();
            $('.touched').removeClass('touched');
            $('.selected').removeClass('selected');
            request = $.parseJSON(request);
            var scene_id = request.id;
            var scene_method = 'on' + scene_id;
            $('section#' + scene_id).show();
            $('section:not(#' + scene_id + ')').hide();
            Tapper.contents[scene_method](request.param);
        } catch (e) {
            console.error("Undefined scene" + scene_id + ".")
        }
    },
    buttonSelect: function (id) {
        var scene_id = parseInt(id, 10);
        var node = $('[data-btn-id=' + scene_id + ']');
        if (node) {
            $('#filter').show();
            node.removeClass('touched');
            node.addClass('selected');
            Tapper.utl.raiseEvent("Tapper/View/ButtonTouched", node.attr('data-btn-id'));
        }
    },
    buttonReset: function (id) {
        $('[data-btn-id].selected').removeClass('selected');
    }
};


/**
 * SubscribeEvent info class
 */
function EventSubscription(event) {
    this._event = event;
    this._internalId = null;
    this._sub = null;
    this._unsubscribe = false;
}
EventSubscription.prototype.setId = function (id) {
    this._internalId = id;
}
EventSubscription.prototype.setSubscriber = function (sub) {
    this._sub = sub;
}
EventSubscription.prototype.unsubscribe = function () {
    if (this._internalId != null && this._sub != null) {
        this._sub.signal.disconnect(this._internalId);
    } else {
        this._unsubscribe = true;
    }
}

$(Tapper.core.init);
