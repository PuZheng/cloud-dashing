define(['backbone', 'views/avg-daily-latency'], 
        function (Backbone, AvgDailyLatencyView) {
            var StatView = Backbone.View.extend({

                initialize: function () {
                    this._avgDailyLatencyView = new AvgDailyLatencyView();
                    this.$el.append(this._avgDailyLatencyView.render().el);
                    return this; 
                },

                updateViewpoint: function (viewpoint) {
                    this._avgDailyLatencyView.updateViewpoint(viewpoint);
                },

                toggleAgent: function (agent) {
                    this._avgDailyLatencyView.toggleAgent(agent);
                },

            });

            return StatView;
        });
