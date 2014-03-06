define(['backbone'], function (Backbone) {
    var DailyReport = Backbone.Model.extend({
        defaults: {
            time: '',
            data: [],
        }, 
        parse: function (response, parse) {
            this.crashNumMap = {}; var that = this;
            response.data.forEach(function (cloudDetail) {
                if (!cloudDetail.hasOwnProperty('计算性能')) {
                    console.log('日报没有提供计算性能');
                    cloudDetail['计算性能'] = {crash_num: 0};
                }
                if (!cloudDetail.hasOwnProperty('磁盘性能')) {
                    console.log('日报没有提供磁盘性能');
                    cloudDetail['磁盘性能'] = {crash_num: 0};
                }
                if (!cloudDetail.hasOwnProperty('网络性能')) {
                    console.log('日报没有提供网络性能');
                    cloudDetail['网络性能'] = {crash_num: 0};
                }
                that.crashNumMap[cloudDetail.id] = cloudDetail['计算性能']['crash_num']+ cloudDetail['磁盘性能']['crash_num'] + (cloudDetail['网络性能']['crash_num'] || 0);
            });
            return response;
        },

        agentCrashNum: function (agentId) {
            return this.crashNumMap[agentId];
        },
        
    });
    return DailyReport;
});
