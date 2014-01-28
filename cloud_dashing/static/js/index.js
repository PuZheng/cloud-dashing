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
    
    var cloudsMap = {};

    function initMap() {
        var chinaGeoCenter = new BMap.Point(103.336594, 35.849248);
        var map = new BMap.Map("map");
        map.centerAndZoom(chinaGeoCenter, 5); 
        var  mapStyle ={ 
            features: ["water", "land"]
        };
        map.setMapStyle(mapStyle);
        map.addControl(new BMap.NavigationControl());
        var viewpointSwitcher = null;
        // 首先获取观察点列表， 再获取云列表，再获取当前用户的位置，然后获取
        // 各个云的状态信息
        getViewpoints(function(viewpoints) {
            viewpointSwitcher = new ViewpointSwitcher(viewpoints, map, 
                function(viewpointSwitcher) {
                    var currentTime = new Date();
                    var start = new Date(currentTime.getFullYear(), currentTime.getMonth(), 
                            currentTime.getDate(), 0, 0, 0);
                    var end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
                    getStatusList(viewpointSwitcher.getCurrentViewpoint(), start, end,
                            function (reports, start) {
                                var timeLinePlot = drawTimeLine($('#timeline'), reports, start);
                                timeLinePlot.setOnDateSelected(function (date) {
                                    showClouds(reports, date);
                                });
                            }); 
                });   
            map.addControl(viewpointSwitcher);
            getClouds(function (clouds) {
                var myGeo = new BMap.Geocoder();
                for (var i=0; i < clouds.length; ++i) {
                    var cloud = clouds[i];
                    cloudsMap[cloud.id]  = cloud;
                    (function (aCloud) {
                        myGeo.getPoint(aCloud.location, function(point){
                            if (point) {
                                aCloud.point = point;
                                aCloud.marker = new CloudMarker(aCloud.id, point);
                                map.addOverlay(aCloud.marker);
                            }
                            var marksAllSet = true;
                            for (var cid in cloudsMap) {
                                marksAllSet = marksAllSet && cloudsMap[cid].marker;
                            }
                            if (marksAllSet) {
                                getUserLocation(viewpoints, function (viewpoint) {
                                    viewpointSwitcher.setViewpoint(viewpoint); 
                                });
                            }
                        }, cloud.location);
                    })(cloud);
                }
            });
        });
    }
    initMap();

    function showClouds(reports, date) {
        var date = date.getTime();
        var report = null;
        for (var i=0; i < reports.length; ++i) {
            if (reports[i].at > date) {
                report = reports[i - 1];
                break;
            }
        }
        if (!report) {
            report = reports[reports.length - 1];
        }
        if (report) {
            for (var i=0; i < report.statusList.length; ++i) {
                var cloudStatus = report.statusList[i];
                var cloud = cloudsMap[cloudStatus.id];
                cloud.marker.update(cloudStatus.latency);
            }
        }
    }


})();
