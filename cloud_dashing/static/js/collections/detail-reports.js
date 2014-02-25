/**
 * Created by Young on 14-2-24.
 */
define(["backbone", 'models/detail-report'], function (Backbone, Report) {
    var AgentDetailReports = Backbone.Collection.extend({
        constructor: function (viewpoint, start, end) {
            this.viewpoint = viewpoint;
            this.start = start;
            this.end = end;
            Backbone.Collection.apply(this, arguments);
        },

        url: function () {
            return "/basic/" + this.viewpoint.id + "?start=" + this.start + "&end=" + this.end + "&features=cpu,hd";
        },
        model: Report
    });
    return AgentDetailReports;
});