/**
 * Created by Young on 14-3-17.
 */
define(['backbone', 'models/detail-report', 'collections/agents', 'common'], function (Backbone, DetailReport, agents, common) {
    var DetailReports = Backbone.Collection.extend({

        model: DetailReport,

        constructor: function (viewpoint, clouds, start, end) {
            this.viewpoint = viewpoint;
            this.clouds = clouds;
            this.start = start;
            this.end = end;
            Backbone.Collection.apply(this, arguments);
        },

        url: function () {
            console.log('http://' + common.SERVER_IP + '/api/details?cloud-id-list=' + this.clouds.map(function (cloud) {return cloud.id}).join(',') + '&at=' + this.start / 1000 + ',' + this.end / 1000 + "&clouds=" + this.viewpoint.id);
            return 'http://' + common.SERVER_IP + '/api/details?cloud-id-list=' + this.clouds.map(function (cloud) {return cloud.id}).join(',') + '&at=' + this.start / 1000 + ',' + this.end / 1000 + "&clouds=" + this.viewpoint.id;
        },

        parse: function (resp, options) {
            var result = [];
            _.each(resp, function (val) {
                if (!!val.data && !(_.isEmpty(val.data))) {
                    val.data.forEach(function (subReport) {
                        if (!subReport.hasOwnProperty('计算性能')) {
                            console.log(val.time + '没有提供计算性能');
                            subReport['计算性能'] = null;
                        }
                        if (!subReport.hasOwnProperty('存储性能')) {
                            console.log(val.time + '没有提供存储性能');
                            subReport['存储性能'] = null;
                        }
                        if (!subReport.hasOwnProperty('网络性能')) {
                            console.log(val.time + '没有提供网络性能');
                            subReport['网络性能'] = null;
                        } else {
                            subReport['网络性能'] = subReport['网络性能'][0];
                            delete subReport['网络性能']['id'];
                        }
                    });
                    result.push({time: val.time, data: val.data});
                }
            });
            return result;
        }
    });
    return DetailReports;
});
