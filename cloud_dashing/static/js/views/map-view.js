define(['backbone', 'collections/agents'], function (Backbone, ViewpointSwitcher, agents) {
    
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
            return this;
        },

        updateLatency: function (report1, report2, pos) {
            alert('map'); 
        }
    });


    return MapView;
});
