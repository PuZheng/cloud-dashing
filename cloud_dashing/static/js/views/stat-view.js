define(['backbone', 'views/avg-daily-latency', 'views/cpu-score-view', 'views/hd-score-view', 'views/stable-view'], 
        function (Backbone, AvgDailyLatencyView, CpuScoreView, HdScoreView, StableView) {
            var StatView = Backbone.View.extend({

                initialize: function () {
                    this._stableView = new StableView();
                    this.$el.append(this._stableView.render().el);
                    this._avgDailyLatencyView = new AvgDailyLatencyView();
                    this.$el.append(this._avgDailyLatencyView.render().el);
                    this._cpuScoreView = new CpuScoreView();
                    this.$el.append(this._cpuScoreView.render().el);
                    this._hdScoreView = new HdScoreView();
                    this.$el.append(this._hdScoreView.render().el);
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

            });

            return StatView;
        });
