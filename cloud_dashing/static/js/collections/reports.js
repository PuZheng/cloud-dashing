define(['jquery', 'backbone', 'underscore', 'models/report', 'collections/agents'], function ($, Backbone, _, Report, agents) {

    var Reports = Backbone.Collection.extend({

        model: Report,

        constructor: function (viewpoint, start, end) {
            this.viewpoint = viewpoint;
            this.start = start;
            this.end = end;
            Backbone.Collection.apply(this, arguments);
        },

        url: function () {
            return 'http://115.28.137.212/api/basic/' + this.viewpoint.id + '?at=' + this.start / 1000 + ',' + this.end / 1000;
        },
        //parse: function (resp, options) {
            //var result = [];
            //var viewpointId = this.viewpoint.id;
            //_.each(resp, function (val) {
                //if (!(_.isEmpty(val.data))) {
                    //if (!val.data.hasOwnProperty('计算性能')) {
                        //console.log('时间点没有提供计算性能');
                        //val.data['计算性能'] = {
                            //crashed: 0,
                            //分数: null, 
                        //};
                    //}
                    //if (!val.data.hasOwnProperty('磁盘性能')) {
                        //console.log('时间点没有提供磁盘性能');
                        //val.data['磁盘性能'] = {
                            //crashed: 0,
                            //分数: null, 
                        //};
                    //}
                    //if (!val.data.hasOwnProperty('网络性能')) {
                        //console.log('时间点没有提供网络性能');
                        //val.data['网络性能'] = agents.filter(function (agent) {
                            //return agent.id != viewpointId;
                        //}).map(function (agent) { 
                            //return {
                                //id: agent.id,
                                //分数: null, 
                                //crashed: 0
                            //};
                        //});
                    //} 
                    //result.push(val);
                //}
            //});
            //return result;
        //}
    });

    return Reports;
});
