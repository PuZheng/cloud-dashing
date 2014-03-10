define(['backbone', 'views/map-view', 'views/control-panel', 'views/timeline', 'views/table-view',
    'collections/agents', 'collections/timespots', 'router/app-router', 'views/stat-view', 'views/toast-view'],
    function (Backbone, MapView, ControlPanel, Timeline, TableView,  agents, timespots, router, StatView, ToastView) {
        Backbone.Notifications = {};
        _.extend(Backbone.Notifications, Backbone.Events);
        var AppView = Backbone.View.extend({
            el: '#main',

            initialize: function (router) {
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
                this._router = router;
                this._router.on('route:filter', this.route, this);
            },

            route: function (param) {
                param = param || 'map';
                this.$('ul.view-switcher li').each(function () {
                    var toggle = $(this).find('a').attr('href') === "#" + param;
                    $(this).toggleClass('active', toggle);
                });
                this._filter = param;
                Backbone.Notifications.trigger("toastShow");
                switch (param) {
                    case 'map':
                        this.$('div.map').show();
                        this.$('div.timeline').show();
                        this.$('div.table-view').hide();
                        this.$('div.stat').hide();
                        if(!!this._map) {
                            this._map.drawMap();
                        }
                        if (!!this._tl) {
                            this._tl.makePlot(this._viewpoint);
                        }
                        break;
                    case 'table':
                        this.$('div.map').hide();
                        this.$('div.timeline').show();
                        this.$('div.table-view').show();
                        this.$('div.stat').hide();

                        if (!!this._tl) {
                            this._tl.makePlot(this._viewpoint);
                        }
                        break;
                    case 'stat':
                        this.$('div.map').hide();
                        this.$('div.timeline').hide();
                        this.$('div.table-view').hide();
                        this.$('div.stat').show();

                        if (!!this._stat) {
                            // 展示后必须重画
                            this._stat.updateViewpoint(this._viewpoint);
                            this._tl.pause();
                            this._cp.updateLatency();
                        }
                        break;
                    default:
                        break;
                }
            },


            _render: function () {
                this._map = new MapView({el: this.$('.map')}).render();
                this._table = new TableView({el: this.$(".table-view")}).render();
                this.$(".table-view").append(this._table.el);
                this._tl = new Timeline({el: this.$('.timeline')});
                this._stat = new StatView({el: this.$('.stat')});
                this._cp = new ControlPanel({el: this.$('.control-panel')});
                this._tl.on('time-changed', function (data) {
                    if (this._filter !== 'stat') {
                        this._cp.updateLatency(data);
                    }
                    this._map.updateLatency(data);
                    this._table.updateTimeSpot(data);
                }, this);
                this._cp.on('viewpoint-set', this._onViewpointSet, this);
                this._cp.on('agent-toggle', this._onAgentToggle, this);
                this._cp.render();
                this._toast = new ToastView();
            },

            _onViewpointSet: function (viewpoint) {
                Backbone.Notifications.trigger("toastShow");
                this._viewpoint = viewpoint;
                this._tl.makePlot(viewpoint);
                this._map.updateTooltip(viewpoint);
                this._stat.updateViewpoint(viewpoint);
                this._table.updateViewpoint(viewpoint);
            },

            _onAgentToggle: function (agent) {
                this._tl.toggleAgent(agent);
                this._map.toggleAgent(agent);
                this._stat.toggleAgent(agent);
            }

        });
        return AppView;
    });
