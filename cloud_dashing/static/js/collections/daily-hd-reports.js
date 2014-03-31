define(['jquery', 'backbone', 'moment', 'models/daily-hd-report', 'common'], 
function ($, Backbone, moment, DailyHdReport, common) { 
    var DailyHdReports = Backbone.Collection.extend({

        model: DailyHdReport,
        
        constructor: function (viewpoint, cloud, start, end) {
            this.viewpoint = viewpoint;
            this.cloud = cloud;
            this.start = start;
            this.end = end;
            Backbone.Collection.apply(this, arguments);
        },

        url: function () {
            return 'http://' + common.SERVER_IP + '/api/hd-sum/' + this.cloud.id + '?date=' + moment(this.start).format('YYYY-MM-DD') + ',' + moment(this.end).format('YYYY-MM-DD');
        },
        
    });

    return DailyHdReports;
});
