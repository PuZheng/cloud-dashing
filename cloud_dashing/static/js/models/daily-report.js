define(['backbone'], function (Backbone) {
    var DailyReport = Backbone.Model.extend({
        defaults: {
            time: '',
            data: [],
        }, 
        parse: function (response, parse) {
            this.crashNumMap = {};
            var that = this;
            response.data.forEach(function (cloudDetail) {
                that.crashNumMap[cloudDetail.id] = cloudDetail['计算性能']['crash_num']+ cloudDetail['磁盘性能']['crash_num'] + (cloudDetail['网络性能']['crash_num'] || 0);
            });
            return response;
        },

        agentCrashNum: function (agentId) {
            return this.crashNumMap[agentId];
        }
    });
    return DailyReport;
});
