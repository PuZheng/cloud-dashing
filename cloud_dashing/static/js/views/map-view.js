define(['backbone', 'handlebars', 'collections/agents', 'widgets/mult-agent-marker', 'widgets/map-help-button', 'underscore', 'text!templates/map-help-modal.hbs', 'kineticjs'], function (Backbone, Handlebars, agents, MultAgentMarker, MapHelpButton, _, helpModalTemplate, Kinetic) {

    var MapView = Backbone.View.extend({

        _helpModalTemplate: Handlebars.default.compile(helpModalTemplate),

        render: function () {
            $("<div class='map-block'></div>").appendTo(this.$el);
            return this;
        },

        drawMap: function () {
            if (this.$el.is(":visible") && this._map == undefined) {
                //var chinaGeoCenter = new BMap.Point(103.336594, 37.849248);
                var chinaGeoCenter = new BMap.Point(103.336594, 27.849248);
                var map = new BMap.Map(this.$('.map-block')[0]);
                map.centerAndZoom(chinaGeoCenter, 4);
                var mapStyle = {
                    features: ["water", "land"]
                };
                map.setMapStyle(mapStyle);
                map.addControl(new BMap.NavigationControl());
                this._map = map;
                this.$el.append('<div id="latency-flow"></div>');
                var mapPos = this.$('.map-block').position();
                this.$('#latency-flow').css({
                    position: 'absolute',
                    width: this.$el.width(),
                    height: this.$el.height(),
                    left: mapPos.left,
                    top: mapPos.top,
                });
            }
            if (this._map && _.isEmpty(this._markers)) {
                var that = this;
                this._stage = new Kinetic.Stage({
                    container: 'latency-flow',
                    width: this.$el.width(),
                    height: this.$el.height(),
                });
                var layer = new Kinetic.Layer();
                this._stage.add(layer);
                this._markers = MultAgentMarker.initMarkers(agents.filter(function (agent) {return agent.get('type') != 1;}), layer);
                this._layer = layer;
                _.each(this._markers, function (marker) {
                    that._map.addOverlay(marker);
                });
                map.addEventListener('movestart', function () {
                    this._layer.hide();
                }.bind(this));
                map.addEventListener('zoomstart', function () {
                    this._layer.hide();
                }.bind(this));
                map.addEventListener('moveend', function () {
                    if (!!this._markers) {
                        _.forEach(this._markers, function (marker) {
                            marker.updateViewpoint(this._viewpoint);
                        }.bind(this));
                    }
                    this._layer.show();
                }.bind(this));
                map.addEventListener('zoomend', function () {
                    if (!!this._markers) {
                        _.forEach(this._markers, function (marker) {
                            marker.updateViewpoint(this._viewpoint);
                        }.bind(this));
                    }
                    this._layer.show();
                }.bind(this));
            }
            if (!!this._viewpoint) {
                this.updateViewpoint(this._viewpoint, true);
            }
            var anim = new Kinetic.Animation((function (lines, step) {
                    return function (frame) {
                        if ((step &  31) === 0) {
                            lines.forEach(function (line) {
                                var span = (5 - line.strokeWidth()) * 2;
                                var dash = null;
                                switch ((step >> 4) % 4) {
                                    case 0:
                                        dash = [span, span];
                                        break;
                                    case 1:
                                        dash = [0, span/2, span, span/2];
                                        break;
                                    case 2:
                                        dash = [0, span, span, 0];
                                        break;
                                    case 3:
                                        dash = [span/2, span, span/2, 0];
                                        break;
                                    default:
                                        break;
                                }
                                line.dash(dash);
                                line.getStage().draw();
                            });
                        }
                        ++step;
                    };
                })([].concat.apply([], this._markers.map(function (marker) {return marker.getLines();})), 0));
            anim.start();
        },

        updateLatency: function (result) {
            var data = {};
            _.forEach(result, function (val) {
                if (!!val) {
                    data[val.get("agent").get("id")] = val.get("latency");
                }
            });
            _.forEach(this._markers, function (marker) {
                marker.update(data);
            });
            this._stage.draw();
        },

        toggleAgent: function (agent) {
            _.each(this._markers, function (marker, idx) {
                marker.toggleAgent();
            });
            this._stage.draw();
        },

        _setViewpoint: function (viewpoint) {
            this._viewpoint = viewpoint;
            var point = new BMap.Point(viewpoint.point.lng, viewpoint.point.lat);
            var marker = new BMap.Marker(point, 
                    {
                        icon: new BMap.Icon('/static/assets/marker.png', 
                                  new BMap.Size(16, 16), 
                                  {
                                      anchor: new BMap.Size(8, 16),
                                  }),
                    }
                    );  // 创建标注
            var that = this;
            that._map.addOverlay(marker);              // 将标注添加到地图中
            if (!!this._viewpointMarker) {
                this._map.removeOverlay(this._viewpointMarker);
            }
            this._viewpointMarker = marker;
            //that._map.addOverlay(new BMap.Marker(point));              // 将标注添加到地图中
            marker.setAnimation(BMAP_ANIMATION_BOUNCE);
            setTimeout(function () {
                marker.setAnimation(null);
            }, 1500);
        },

        updateViewpoint: function (viewpoint) {
            this._setViewpoint(viewpoint);
            if (!!this._markers) {
                _.forEach(this._markers, function (marker) {
                    marker.updateViewpoint(viewpoint);
                });
            }
        }
    });


    return MapView;
});
