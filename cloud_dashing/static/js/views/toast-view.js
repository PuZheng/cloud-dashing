/**
 * Created by Young on 14-3-7.
 */
define(['backbone'], function (Backbone) {
    var ToastView = Backbone.View.extend({
        initialize: function (content) {
            this.timeout_id = null;
            this.duration = 1500;
            this.content = content ? content : "正在加载...";
            this.position = "top";
            Backbone.Notifications.on("toastShow", this._show, this);
        },

        _show: function () {
            clearTimeout(this.timeout_id);
            var body = $("body");
            var previous_toast = $("#toast_container");
            if (previous_toast) {
                previous_toast.remove();
            }
            var toast_container = $("<div></div>").addClass("toast_fadein").attr("id", "toast_container");
            if (this.position == "top") {
                toast_container.addClass("toast_top");
            }
            body.append(toast_container);
            var toast = $("<div></div>").attr("id", "toast").html(this.content);
            toast_container.html(toast);
            this.timeout_id = setTimeout(this._hide, this.duration);
        },

        _hide: function () {
            var toast_container = $("#toast_container");
            if (!toast_container) {
                return false;
            }
            clearTimeout(this.timeout_id);

            toast_container.addClass("toast_fadeout");
            toast_container.hide();
            toast_container.bind("webkitAnimationEnd", function () {
                toast_container.remove();
            });
            return true;
        }

    });
    return ToastView;
});