define(['backbone'], function (Backbone) {
    
    var MapView = Backbone.View.extend({
        render: function () {
            var chinaGeoCenter = new BMap.Point(103.336594, 35.849248);
            var map = new BMap.Map(this.$el[0]);
            map.centerAndZoom(chinaGeoCenter, 5); 
            var  mapStyle ={ 
                features: ["water", "land"]
            };
            map.setMapStyle(mapStyle);
            map.addControl(new BMap.NavigationControl());
            return this;
        },
    });

    return MapView;
});
