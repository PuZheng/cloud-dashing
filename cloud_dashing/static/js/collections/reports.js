define(['jquery', 'backbone', 'models/report'], function ($, Backbone, Report) {

    var Reports = Backbone.Collection.extend({

        model: Report,
        
        constructor: function (viewpoint, start, end) {
            this.viewpoint = viewpoint;
            this.start = start;
            this.end = end;
            Backbone.Collection.apply(this, arguments);
        },

        url: function () {
            return 'api/reports?viewpoint_id=' + this.viewpoint.id + '&start=' + this.start + '&end=' + this.end;
        },

    });

    return Reports;
});
