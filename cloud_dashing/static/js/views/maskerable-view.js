/**
 * Created by Young on 14-3-10.
 */
define(['jquery', 'backbone'], function ($, Backbone) {
    var MaskerableView = Backbone.View.extend({
        initialize: function (options) {
            if (_.isObject(options)) {
                this._maskedView = options.maskedView;
            }

        },

        maskerView: function (masked, mask) {
            this._maskedView = masked;
            this._mask = mask;
        },

        mask: function () {
            if (!this._maskedView) {
                return false;
            }
            this._maskedView.hide();
            this._mask.show();
            return true;
        },

        unmask: function () {
            this._mask.hide();
            this._maskedView.show();
            return true;
        }
    });
    return MaskerableView;
});
