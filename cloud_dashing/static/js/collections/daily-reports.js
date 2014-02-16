define(['jquery', 'backbone', 'models/daily-report'], function ($, Backbone, DailyReport) {

    var DailyReports = Backbone.Collection.extend({

        model: DailyReport,
        
        constructor: function (viewpoint, start, end) {
            this.viewpoint = viewpoint;
            this.start = start;
            this.end = end;
            Backbone.Collection.apply(this, arguments);
        },

        url: function () {
            return 'api/daily-reports/' + this.viewpoint.id + '?start=' + this.start + '&end=' + this.end;
        },

    });

    return DailyReports;
});
