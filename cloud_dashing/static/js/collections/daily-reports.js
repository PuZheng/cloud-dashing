define(['jquery', 'backbone', 'models/daily-report', 'moment'], function ($, Backbone, DailyReport, moment) {

    var DailyReports = Backbone.Collection.extend({

        model: DailyReport,
        
        constructor: function (viewpoint, start, end) {
            this.viewpoint = viewpoint;
            this.start = start;
            this.end = end;
            Backbone.Collection.apply(this, arguments);
        },

        url: function () {
            return 'http://115.28.137.212/api/net-sum/' + this.viewpoint.id + '?date=' +  moment(this.start).format('YYYY-MM-DD') + ',' + moment(this.end).format('YYYY-MM-DD');
        },

    });

    return DailyReports;
});