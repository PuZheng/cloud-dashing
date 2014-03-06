define(['jquery', 'backbone', 'models/daily-report', 'moment', 'common', 'collections/agents'], function ($, Backbone, DailyReport, moment, common, agents) {

    var DailyReports = Backbone.Collection.extend({

        model: DailyReport,
        
        constructor: function (viewpoint, start, end) {
            this.viewpoint = viewpoint;
            this.start = start;
            this.end = end;
            Backbone.Collection.apply(this, arguments);
        },

        url: function () {
            var cloud_id_list = agents.map(function (agent) {return agent.id}).join();
            return 'http://' + common.SERVER_IP + '/api/details-sum?cloud-id-list=' + cloud_id_list + '&features=cpu,hd,net&date=' + moment(this.start).format('YYYY-MM-DD') + ',' + moment(this.end).format('YYYY-MM-DD');
        },
    
    });

    return DailyReports;
});
