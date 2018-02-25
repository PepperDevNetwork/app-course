Tapper.preview = {};

$(function () {
    var _id = 'preview';
    var _index = 0;
    var _resolution = 0;
    var _color = 9;
    var _fps = 5;

    var _canvas;
    var _enablePlay = true;
    var _timer;
    var _handle;
    var _videoDevice;

    function stopPreview() {
        if (_timer) {
            clearTimeout(_timer);
            _timer = null;
        }
        if (_handle) {
            _videoDevice.unsubscribe(_handle);
            _handle = null;
            _videoDevice = null;
        }
        _enablePlay = false;
    }

    function updateImage(videoDevice, handle) {
        if (!_enablePlay) return;

        videoDevice.getImageRemote(handle).then(function (image) {
            if (image) {
                var width = image[0];
                var height = image[1];
                draw(_canvas, image, width, height);
                videoDevice.releaseImage(handle).then(function () {
                    _timer = setTimeout(updateImage(videoDevice, handle), (1000 / _fps));
                }, function (data) {
                    _timer = setTimeout(updateImage(videoDevice, handle), (1000 / _fps));
                });
            }
        }, function (data) {
            _timer = setTimeout(updateImage(videoDevice, handle), (1000 / _fps));
        });
    }

    function initDevice(option) {
        if (option && option.id) {
            _id = option.id;
        }
        if (option && option.index) {
            _index = option.index;
        }
        if (option && option.resolution) {
            _resolution = option.resolution;
        }
        if (option && option.color) {
            _color = option.color;
        }
        if (option && option.fps) {
            _fps = option.fps;
        }

        _canvas = document.getElementById(_id);

        var name = _id + (new Date()) / 1000;
        var videoDevice = Tapper.proxy.ALVideoDevice;
        videoDevice.subscribeCamera(name, _index, _resolution, _color, _fps).then(function (handle) {
            _handle = handle;
            _videoDevice = videoDevice;
            _enablePlay = true;
        }, function (data) {
            setTimeout(initDevice, 1000);
        });
    }

    function startPreview() {
        setTimeout(function () {
            updateImage(_videoDevice, _handle)
        }, 50);
    }

    function yuv2rgba(y, u, v) {
        var r = y + 1.402 * (v - 128);
        var g = y - 0.344 * (u - 128) - 0.714 * (v - 128);
        var b = y + 1.772 * (u - 128);

        return [r, g, b, 0xFF];
    }

    function draw(canvas, src, width, height) {
        var context = canvas.getContext('2d');

        if (!context) return;

        var data = src[6];
        var image = context.createImageData(width, height);
        var imageData = image.data;
        var data_ptr = 0;
        var image_ptr = 0;
        if (src[3] === 0) { 
            while (data_ptr < data.length) {
                imageData[image_ptr] = imageData[image_ptr + 1] = imageData[image_ptr + 2] = data[data_ptr];
                imageData[image_ptr + 3] = 255;
                data_ptr += 1;
                image_ptr += 4;
            }
        } else if (src[3] === 9) {
            while (data_ptr < data.length) {
                var y1 = data[data_ptr];
                var u = data[data_ptr + 1];
                var y2 = data[data_ptr + 2];
                var v = data[data_ptr + 3];

                var rgb1 = yuv2rgba(y1, u, v);
                var rgb2 = yuv2rgba(y2, u, v);

                var rgb = rgb1.concat(rgb2);

                for (var i = 0; i < 8; i++) {
                    imageData[image_ptr + i] = rgb[i];
                }
                data_ptr += 4;
                image_ptr += 8;
            }

        }
        context.putImageData(image, 0, 0);
    }

    Tapper.preview.init = function (option) {
        initDevice(option);
    };

    Tapper.preview.start = function () {
        startPreview();
    };

    Tapper.preview.stop = function () {
        stopPreview();
    };
});
