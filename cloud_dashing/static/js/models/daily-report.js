define(['backbone'], function (Backbone) {
    var DailyReport = Backbone.Model.extend({
        defaults: {
            time: '',
            data: [],
        }, 
        agentCrashNum: function (agentId) {
            return 0;
        }
    });
    return DailyReport;
});
