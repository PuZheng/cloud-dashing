define(['backbone', 'views/map-view', 'views/control-panel', 'views/timeline', 'views/table-view', 'views/matrix-view',
    'collections/agents', 'collections/timespots', 'router/app-router', 'views/stat-view', 'views/toast-view'],
    function (Backbone, MapView, ControlPanel, Timeline, TableView, MatrixView, agents, timespots, router, StatView, ToastView) {
        Backbone.Notifications = {};
        _.extend(Backbone.Notifications, Backbone.Events);
        var AppView = Backbone.View.extend({
            el: '#main',

            initialize: function (router) {
                var that = this;
                this._map = new MapView({el: this.$('.map')}).render();
                agents.fetch({
                    reset: true,
                    success: function (collection, response, options) {
                        var myGeo = new BMap.Geocoder();
                        var deferred = $.Deferred();
                        deferred.promise().then(that._render.bind(that));
                        collection.each(function (agent) {
                            if (!!agent.get('coordinates')) {
                                var point = agent.get('coordinates');
                                point = point.split(':');
                                var point = new BMap.Point(point[0], point[1]);
                                agent.set('point', point);
                                var pointsAllSet = collection.every(function (agent, index, array) {
                                    return !!agent.get('point');
                                });
                                if (pointsAllSet) {
                                    deferred.resolve();
                                }
                            } else {
                                myGeo.getPoint(agent.get('location'), function (point) {
                                    if (!!point) {
                                        agent.set('point', point);
                                        var pointsAllSet = collection.every(function (agent, index, array) {
                                            return !!agent.get('point');
                                        });
                                        if (pointsAllSet) {
                                            deferred.resolve();
                                        }
                                    }
                                });
                            }
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
                switch (param) {
                    case 'map':
                        this.$('.map').show();
                        this.$('.timeline').show();
                        this.$('.table-view').hide();
                        this.$('.stat').hide();
                        this.$('.matrix-view').hide();
                        if (!!this._cp) {
                            this._cp.toggleSelect(false);
                            this._cp.toggleDelayType(true);
                            this._cp.toggleCheckClouds(true);
                        }
                        if (!!this._tl) {
                            this._tl.makePlot(this._viewpoint);
                        }
                        if (!!this._map && !!this._viewpoint) {
                            setTimeout(_.bind(function () {
                                this._map.updateViewpoint(this._viewpoint);
                            }, this), 10);
                        }
                        break;
                    case 'table':
                        this.$('.map').hide();
                        this.$('.timeline').show();
                        this.$('.table-view').show();
                        this.$('.stat').hide();
                        this.$('.matrix-view').hide();
                        if (!!this._cp) {
                            this._cp.toggleSelect(true);
                            this._cp.toggleCheckClouds(false);
                            this._cp.toggleDelayType(true);
                        }
                        if (!!this._tl) {
                            this._tl.makePlot(this._viewpoint);
                        }
                        break;
                    case 'stat':
                        this.$('.map').hide();
                        this.$('.timeline').hide();
                        this.$('.table-view').hide();
                        this.$('.stat').show();
                        this.$('.matrix-view').hide();
                        if (!!this._stat) {
                            // 展示后必须重画
                            this._stat.updateViewpoint(this._viewpoint);
                            this._tl.pause();
                            this._cp.updateLatency();
                        }
                        if (!!this._cp) {
                            this._cp.toggleSelect(true);
                            this._cp.toggleDelayType(false);
                            this._cp.toggleCheckClouds(false);
                        }
                        break;
                    case 'matrix':
                        this.$('div.map').hide();
                        this.$('div.timeline').show();
                        this.$('div.table-view').hide();
                        this.$('div.stat').hide();
                        this.$('.matrix-view').show();
                        if (!!this._cp) {
                            this._cp.toggleSelect(false);
                            this._cp.toggleCheckClouds(true);
                            this._cp.toggleDelayType(true);
                        }
                        if (!!this._tl) {
                            this._tl.makePlot(this._viewpoint);
                        }

                    default:
                        break;
                }
            },


            _render: function () {
                this._table = new TableView({el: this.$(".table-view")}).render();
                if (!!this._map) {
                    this._map.drawMap();
                }
                this._matrixView = new MatrixView({el: this.$('.matrix-view')}).render();
                this.$(".table-view").append(this._table.el);
                this._stat = new StatView({el: this.$('.stat')});
                this._tl = new Timeline({el: this.$('.timeline')});
                this._cp = new ControlPanel({el: this.$('.control-panel')});
                this._tl.on('time-changed', function (data) {
                    if (this._filter !== 'stat') {
                        this._cp.updateLatency(data);
                    }
                    this._map.updateLatency(data);
                    this._table.updateTimeSpot(data);
                    this._matrixView.updateTimeSpot(data);
                }, this);
                this._cp.on('viewpoint-set', this._onViewpointSet, this);
                this._cp.on('agent-toggle', this._onAgentToggle, this);
                this._cp.on('delayType-set', this._onDelayTypeSet, this);
                this._cp.on('cloud-set', this._onCloudSet, this);
                this._cp.render(this._filter);
                this._toast = new ToastView();
            },

            _onCloudSet: function (cloud) {
                this._stat.updateCloud(cloud);
                this._table.updateCloud(cloud);
            },
            _onDelayTypeSet: function (type) {
                this._tl.updateDelayType(type);
            },

            _onViewpointSet: function (viewpoint) {
                Backbone.Notifications.trigger("toastShow");
                this._viewpoint = viewpoint;
                this._tl.makePlot(viewpoint);
                if (this.$('div.map').is(":visible")) {
                    this._map.updateViewpoint(viewpoint);
                }
                this._stat.updateViewpoint(viewpoint);
                this._table.updateViewpoint(viewpoint);
                this._matrixView.updateViewpoint(viewpoint);
            },

            _onAgentToggle: function (agent) {
                this._tl.toggleAgent(agent);
                this._map.toggleAgent(agent);
                this._matrixView.toggleAgent(agent);
            }

        });
        return AppView;
    });
