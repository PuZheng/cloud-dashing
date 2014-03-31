define(['jquery', 'backbone', 'moment', 'models/daily-net-report', 'common'], function ($, Backbone, moment, DailyNetReport, common) {

    var DailyNetReports = Backbone.Collection.extend({

        model: DailyNetReport,
        
        constructor: function (viewpoint, cloud, start, end) {
            this.viewpoint = viewpoint;
            this.cloud = cloud;
            this.start = start;
            this.end = end;
            Backbone.Collection.apply(this, arguments);
        },

        url: function () {
            return 'http://' + common.SERVER_IP + '/api/net-sum/' + this.viewpoint.id + '?date=' + moment(this.start).format('YYYY-MM-DD') + ',' + moment(this.end).format('YYYY-MM-DD') + "&clouds=" + this.cloud.id;
        },
        
    });

    return DailyNetReports;
});
