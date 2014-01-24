(function() {
    function checkhHtml5() {   
        if (typeof(Worker) === "undefined")     
        {   
            if(navigator.userAgent.indexOf("MSIE 9.0")<=0)  
            {  
                alert("定制个性地图示例：IE9以下不兼容，推荐使用百度浏览器、chrome、firefox、safari、IE10");   
            }  

        }  
    }
    checkhHtml5();  
    var chinaGeoCenter = new BMap.Point(103.336594, 35.849248);
    var map = new BMap.Map("map");
    map.centerAndZoom(chinaGeoCenter, 5); 
    var  mapStyle ={ 
        features: ["water", "land"]
    };
    map.setMapStyle(mapStyle);
    map.addControl(new BMap.NavigationControl());

    var beiJing = new BMap.Point(116.404, 39.915);
    var marker = new BMap.Marker(beiJing);
    map.addOverlay(marker);
    marker.setAnimation(BMAP_ANIMATION_BOUNCE); 
    window.setTimeout(function () {
        map.removeOverlay(marker);
    }, 2000);

    function getViewpoints(handler) {
        handler([
                    {name: "北京"},
                    {name: "上海"}
                ]); 
    }

    getViewpoints(function(viewpoints) {
        var viewPointSwitcher = new ViewPointSwitcher(viewpoints);   
        map.addControl(viewPointSwitcher);
    });

})();
