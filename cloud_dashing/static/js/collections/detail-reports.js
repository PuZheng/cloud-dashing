/**
 * Created by Young on 14-3-17.
 */
define(['backbone', 'models/detail-report', 'collections/agents'], function (Backbone, DetailReport, agents) {
    var DetailReports = Backbone.Collection.extend({

        model: DetailReport,

        constructor: function (viewpoint, cloud, start, end) {
            this.viewpoint = viewpoint;
            this.cloud = cloud;
            this.start = start;
            this.end = end;
            Backbone.Collection.apply(this, arguments);
        },
        url: function () {
            return 'http://115.28.137.212/api/details?cloud-id-list=' + this.cloud.id + '&at=' + this.start / 1000 + ',' + this.end / 1000 + "&clouds=" + this.viewpoint.id;
        },
        parse: function (resp, options) {
            var result = [];
            _.each(resp, function (val) {
                if (!(_.isEmpty(val.data))) {
                    var data = val.data[0];
                    if (!data.hasOwnProperty('计算性能')) {
                        console.log(val.time + '没有提供计算性能');
                        data['计算性能'] = null;
                    }
                    if (!data.hasOwnProperty('存储性能')) {
                        console.log(val.time + '没有提供存储性能');
                        data['存储性能'] = null;
                    }
                    if (!data.hasOwnProperty('网络性能')) {
                        console.log(val.time + '没有提供网络性能');
                        data['网络性能'] = null;
                    }
                    result.push({time: val.time, data: data});
                }
            });
            return result;
        }
    });
    return DetailReports;
});
