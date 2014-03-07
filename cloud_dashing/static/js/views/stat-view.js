define(['backbone', 'handlebars', 'views/avg-daily-latency', 'views/cpu-score-view', 'views/hd-score-view', 'views/stable-view', 'text!/static/templates/stat-view.hbs'], 
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
                    this._stableView = new StableView();
                    this.$('#avail').append(this._stableView.render().el);
                    this._avgDailyLatencyView = new AvgDailyLatencyView();
                    this.$('#avg-latency').append(this._avgDailyLatencyView.render().el);
                    this._cpuScoreView = new CpuScoreView();
                    this.$('#cpu-score').append(this._cpuScoreView.render().el);
                    this._hdScoreView = new HdScoreView();
                    this.$('#hd-score').append(this._hdScoreView.render().el);
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
