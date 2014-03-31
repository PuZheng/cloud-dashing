define(['jquery', 'backbone', 'moment', 'models/daily-cpu-report', 'common'], function ($, Backbone, moment, DailyCpuReport, common) {

    var DailyCpuReports = Backbone.Collection.extend({

        model: DailyCpuReport,
        
        constructor: function (viewpoint, cloud, start, end) {
            this.viewpoint = viewpoint;
            this.cloud = cloud;
            this.start = start;
            this.end = end;
            Backbone.Collection.apply(this, arguments);
        },

        url: function () {
            return 'http://' + common.SERVER_IP + '/api/cpu-sum/' + this.cloud.id + '?date=' + moment(this.start).format('YYYY-MM-DD') + ',' + moment(this.end).format('YYYY-MM-DD');
            //return 'api/daily-reports/' + this.viewpoint.id + '?start=' + this.start + '&end=' + this.end;
        },
        
    });

    return DailyCpuReports;
});
