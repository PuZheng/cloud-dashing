define(['backbone', 'collections/agents', 'widgets/agent-marker', 'underscore'], function (Backbone, agents, AgentMarker, _) {
    
    var MapView = Backbone.View.extend({
        render: function () {
            var chinaGeoCenter = new BMap.Point(103.336594, 35.849248);
            var map = new BMap.Map(this.$el[0]);
            map.centerAndZoom(chinaGeoCenter, 4); 
            var  mapStyle ={ 
                features: ["water", "land"]
            };
            map.setMapStyle(mapStyle);
            map.addControl(new BMap.NavigationControl());
            
            this._markers = agents.map(function (agent) {
                var marker = new AgentMarker(agent);
                map.addOverlay(marker);
                return marker;
            }, this);
            return this;
        },

        updateLatency: function (data) {
            _.each(this._markers, function (marker, idx) {
                if (marker.getAgent().get('selected')) {
                    marker.update(data[idx]);
                    marker.show();
                } else {
                    marker.hide();
                }
            });
        },

        toggleAgent: function (agent) {
            _.filter(this._markers, function (marker) {
                return marker.getAgent().get('id') === agent.id;
            }).forEach(function (marker) {
                if (agent.selected) {
                    marker.show();
                } else {
                    marker.hide();
                }
            });
        }
        
    });


    return MapView;
});
