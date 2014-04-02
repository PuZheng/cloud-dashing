/**
 * 统计
 */
define(['backbone', 'handlebars', 'views/avg-daily-latency', 'views/cpu-score-view', 'views/hd-score-view', 'views/stable-view', 'text!templates/stat-view.hbs'],
        function (Backbone, Handlebars, AvgDailyLatencyView, CpuScoreView, HdScoreView, StableView, statViewTemplate) {
            var StatView = Backbone.View.extend({

                _template: Handlebars.default.compile(statViewTemplate),


                events: {
                    'shown.bs.tab a[href="#avg-latency"]': function (e) {
                        this._avgDailyLatencyView.updateViewpoint();
                    },
                    'shown.bs.tab a[href="#cpu-score"]': function (e) {
                        this._cpuScoreView.updateViewpoint();
                    },
                    'shown.bs.tab a[href="#hd-score"]': function (e) {
                        this._hdScoreView.updateViewpoint();
                    },
                },

                initialize: function () {
                    this.$el.append(this._template());
                    this._stableView = new StableView({el: this.$('#avail')}).render();
                    this._avgDailyLatencyView = new AvgDailyLatencyView({el: this.$('#avg-latency')}).render();
                    this._cpuScoreView = new CpuScoreView({el: this.$('#cpu-score')}).render();
                    this._hdScoreView = new HdScoreView({el: this.$('#hd-score')}).render();
                    return this; 
                },

                updateViewpoint: function (viewpoint) {
                    this._avgDailyLatencyView.updateViewpoint(viewpoint);
                    this._cpuScoreView.updateViewpoint(viewpoint);
                    this._hdScoreView.updateViewpoint(viewpoint);
                    this._stableView.updateViewpoint(viewpoint);
                },

                toggleAgent: function (agent) {
                    this._avgDailyLatencyView.toggleAgent(agent);
                    this._stableView.toggleAgent(agent);
                },

                updateCloud: function(cloud) {
                    this._stableView.updateCloud(cloud);
                    this._avgDailyLatencyView.updateCloud(cloud);
                    this._hdScoreView.updateCloud(cloud);
                    this._cpuScoreView.updateCloud(cloud);
                }

            });

            return StatView;
        });
