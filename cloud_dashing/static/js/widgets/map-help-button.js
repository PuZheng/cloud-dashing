define(['jquery'], function ($) {

    var MapHelpButton = function (target) {
        this._length = 36; 
        this._target = target;
    }

    MapHelpButton.prototype = new BMap.Overlay();
   
    MapHelpButton.prototype.initialize = function (map) {
        this._map = map;
        this._tag = $('<button type="button" data-toggle="modal" data-target="' + this._target + '" class="help-btn btn btn-default btn-sm"><i class="fa fa-question-circle"></i></button>').css({
            position: 'absolute',
            width: this._length + 'px',
            height: this._length + 'px',
        });
        map.getPanes().labelPane.appendChild(this._tag[0]);
        return this._tag[0];
    }

    MapHelpButton.prototype.getTag = function () {
        return this._tag;
    }

    MapHelpButton.prototype.draw = function () {
        var bounds = this._map.getBounds();  
        var point = this._map.pointToOverlayPixel(bounds.getNorthEast());
        this._tag.css({
            left: point.x - this._length + "px",
            top: point.y + "px"
        });
    };

    return MapHelpButton;
});
