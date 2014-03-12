define(['backbone', 'handlebars', 'collections/agents', 'widgets/mult-agent-marker', 'widgets/map-help-button', 'underscore', 'text!/static/templates/map-help-modal.hbs'], function (Backbone, Handlebars, agents, MultAgentMarker, MapHelpButton, _, helpModalTemplate) {

    var MapView = Backbone.View.extend({

        _helpModalTemplate: Handlebars.default.compile(helpModalTemplate),

        render: function () {
            $("<div class='map-block'><i class='fa fa-spinner fa-spin fa-4x'></i></div>").appendTo(this.$el);
            this.$el.append(this._helpModalTemplate());
            return this;
        },

        drawMap: function () {
            if (this.$el.is(":visible") && this._map == undefined) {
                var chinaGeoCenter = new BMap.Point(103.336594, 35.849248);
                var map = new BMap.Map(this.$('.map-block')[0]);
                map.centerAndZoom(chinaGeoCenter, 4);
                var mapStyle = {
                    features: ["water", "land"]
                };
                map.setMapStyle(mapStyle);
                map.addControl(new BMap.NavigationControl());
                var mapHelpButton = new MapHelpButton('.map-help-modal');
                map.addOverlay(mapHelpButton);
                this._map = map;
            }
            if (this._map && _.isEmpty(this._markers)) {
                var that = this;
                this._markers = MultAgentMarker.initMarkers(agents);
                _.each(this._markers, function (marker) {
                    that._map.addOverlay(marker);
                });
            }
            if (!!this._viewpoint) {
                this.updateTooltip(this._viewpoint);
            }
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
        },

        toggleAgent: function (agent) {
            _.each(this._markers, function (marker, idx) {
                marker.toggleAgent();
            });
        },

        _setViewpoint: function (viewpoint) {
            this._viewpoint = viewpoint;
            var point = new BMap.Point(viewpoint.point.lng, viewpoint.point.lat);
            var marker = new BMap.Marker(point);  // 创建标注
            var that = this;
            that._map.addOverlay(marker);              // 将标注添加到地图中
            marker.setAnimation(BMAP_ANIMATION_BOUNCE);
            setTimeout(function () {
                that._map.removeOverlay(marker);
            }, 1500);
        },

        updateTooltip: function (viewpoint) {
            this._setViewpoint(viewpoint);
            if (!!this._markers) {
                _.forEach(this._markers, function (marker) {
                    marker.updateTooltip(viewpoint);
                });
            }
        }
    });


    return MapView;
});
