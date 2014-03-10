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

        maskerView: function (view) {
            this._maskedView = view;
        },

        mask: function () {
            if (!this._maskedView) {
                return false;
            }
            if (!this._masker) {
                this._masker = $("<div></div>").height("100%").width("100%").css("line-height", "100%").addClass("text-center").html(
                    $("<img></img>").attr("src", "/static/img/ajax-loader.gif").css({"vertical-align": "middle"})
                );
            }
            this._maskedView.after(this._masker);
            this._maskedView.hide();
            this._masker.show();
            return true;
        },
        unmask: function () {
            if (!this._maskedView || !this._masker) {
                return false;
            }
            this._maskedView.show();
            this._masker.hide();
            return true;
        }
    });
    return MaskerableView;
});