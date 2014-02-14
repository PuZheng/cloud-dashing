define(['backbone', 'views/map-view', 'views/control-panel', 'views/timeline', 'views/table-view',
    'collections/agents', 'collections/timespots', 'router/app-router'],
    function (Backbone, MapView, ControlPanel, Timeline, tableView,  agents, timespots, AppRouter) {
        var router = new AppRouter();
        Backbone.history.start();
        var AppView = Backbone.View.extend({
            el: '#main',

            initialize: function () {
                var that = this;
                agents.fetch({
                    reset: true,
                    success: function (collection, response, options) {
                        var myGeo = new BMap.Geocoder();
                        var deferred = $.Deferred();
                        deferred.promise().then(that._render.bind(that));
                        collection.each(function (agent) {
                            myGeo.getPoint(agent.get('location'), function (point) {
                                agent.set('point', point);
                                var pointsAllSet = collection.every(function (agent, index, array) {
                                    return !!agent.get('point');
                                });
                                if (pointsAllSet) {
                                    deferred.resolve();
                                }
                            });
                        });
                    }
                });
            },

            _render: function () {
                this._map = new MapView({el: this.$('.map')}).render();
                this._table = tableView.render();
                this.$(".table").append(this._table.el);
                this._tl = new Timeline({el: this.$('.timeline')});
                this._cp = new ControlPanel({el: this.$('.control-panel')});
                this._tl.on('time-changed', function (data) {
                    this._cp.updateLatency(data);
                    this._map.updateLatency(data);
                    this._table.updateStatus(data);
                }, this);
                this._cp.on('viewpoint-set', this._onViewpointSet, this);
                this._cp.on('agent-toggle', this._onAgentToggle, this);
                this._cp.render();
            },

            _onViewpointSet: function (viewpoint) {
                this._tl.makePlot(viewpoint);
            },

            _onAgentToggle: function (agent) {
                this._tl.toggleAgent();
                this._map.toggleAgent(agent);
                this._table.toggleAgent();
            },

        });
        return AppView;
    });
