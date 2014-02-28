define(['backbone', 'collections/agents', 'widgets/mult-agent-marker', 'underscore'], function (Backbone, agents, MultAgentMarker, _) {
    
    var MapView = Backbone.View.extend({
        render: function () {
            this.drawMap();
            return this;
        },

        drawMap: function () {
            if (this.$el.is(":visible") && this._map == undefined) {
                var chinaGeoCenter = new BMap.Point(103.336594, 35.849248);
                var map = new BMap.Map(this.$el[0]);
                map.centerAndZoom(chinaGeoCenter, 4);
                var mapStyle = {
                    features: ["water", "land"]
                };
                map.setMapStyle(mapStyle);
                map.addControl(new BMap.NavigationControl());

                this._markers = MultAgentMarker.initMarkers(agents);
                _.each(this._markers, function (marker) {
                    map.addOverlay(marker);
                });
                this._map = map;
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

        updateTooltip: function (viewpoint) {
            if (!!this._markers) {
                _.forEach(this._markers, function (marker) {
                    marker.updateTooltip(viewpoint);
                });
            }
        }
    });


    return MapView;
});
