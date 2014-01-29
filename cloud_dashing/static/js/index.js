(function () {
    function initMap() {
        var chinaGeoCenter = new BMap.Point(103.336594, 35.849248);
        var map = new BMap.Map("map");
        map.centerAndZoom(chinaGeoCenter, 5); 
        var  mapStyle ={ 
            features: ["water", "land"]
        };
        map.setMapStyle(mapStyle);
        map.addControl(new BMap.NavigationControl());
        return map;
    }
    require.config({
        baseUrl: '/static/components',
        paths: {
            echarts: 'echarts/build/echarts',
            'echarts/chart/bar': 'echarts/build/echarts',
            'echarts/chart/line': 'echarts/build/echarts',
            'echarts/chart/map': 'echarts/build/echarts-map',
            jquery: 'jquery/jquery.min',
            functions: '/static/js/functions',
            utils: '/static/js/utils',
            viewpointSwitcher: '/static/js/viewpoint-switcher',
            cloudMarker: '/static/js/cloud-marker',
            timeline: '/static/js/timeline',
        }
    });

    require([
                'jquery',
                'echarts',
                'echarts/chart/bar',
                'echarts/chart/line',
                'echarts/chart/map',
                'functions',
                'viewpointSwitcher',
                'cloudMarker',
                'timeline',
            ],
            function($, ec, ecb, ecl, ecm, functions, vps, cm, tl) {
                // initialize map
                var map = initMap();
                var viewpointSwitcher = null;
                $.when(functions.getViewpoints(), functions.getClouds()).then(function (viewpoints, clouds) {
                    // show viewpoint switcher
                    viewpointSwitcher = new vps.ViewpointSwitcher(viewpoints,
                        function (oldViewpoint, newViewpoint, viewpointSwitcher) {
                            var timeline = new tl.Timeline(newViewPoint, clouds, getStart(), getEnd());
                            timeline.init($(timeline)[0]);
                        });
                    map.addControl(viewpointSwitcher);
                    for (var i=0; i < clouds.length; ++i) {
                        var cloud = clouds[i];
                        cloud.marker = new cm.CloudMarker(cloud.id, cloud.point);
                        map.addOverlay(cloud.marker);
                    }
                }).then(function (viewpoints, clouds) {
                    return functions.getUserLocation();
                }).done(function (currentViewpoint, viewpoints, clouds) {
                    viewpointSwitcher.setViewpoint(currentViewpoint);
                });
                //--- 折柱 ---
                var myChart = ec.init(document.getElementById('timeline'));
                myChart.setOption({
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['蒸发量','降水量']
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : true,
                            dataView : {readOnly: false},
                            magicType:['line', 'bar'],
                            restore : true,
                            saveAsImage : true
                        }
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            splitArea : {show : true}
                        }
                    ],
                    series : [
                        {
                            name:'蒸发量',
                            type:'bar',
                            data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
                        },
                        {
                            name:'降水量',
                            type:'bar',
                            data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                        }
                    ]
                });
                
            });
})();
    //(function() {
        //checkhHtml5();  
        
        //var cloudsMap = {};

        //function initMap() {
            //var chinaGeoCenter = new BMap.Point(103.336594, 35.849248);
            //var map = new BMap.Map("map");
            //map.centerAndZoom(chinaGeoCenter, 5); 
            //var  mapStyle ={ 
                //features: ["water", "land"]
            //};
            //map.setMapStyle(mapStyle);
            //map.addControl(new BMap.NavigationControl());
            //var viewpointSwitcher = null;
            //// 首先获取观察点列表， 再获取云列表，再获取当前用户的位置，然后获取
            //// 各个云的状态信息
            //getViewpoints(function(viewpoints) {
                //viewpointSwitcher = new ViewpointSwitcher(viewpoints, map, 
                    //function(viewpointSwitcher) {
                        //var currentTime = new Date();
                        //var start = new Date(currentTime.getFullYear(), currentTime.getMonth(), 
                                //currentTime.getDate(), 0, 0, 0);
                        //var end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
                        //getStatusList(viewpointSwitcher.getCurrentViewpoint(), start, end,
                                //function (reports, start) {
                                    //var timeLinePlot = drawTimeLine($('#timeline'), reports, start);
                                    //timeLinePlot.setOnDateSelected(function (date) {
                                        //showClouds(reports, date);
                                    //});
                                //}); 
                    //});   
                //map.addControl(viewpointSwitcher);
                //getClouds(function (clouds) {
                    //var myGeo = new BMap.Geocoder();
                    //for (var i=0; i < clouds.length; ++i) {
                        //var cloud = clouds[i];
                        //cloudsMap[cloud.id]  = cloud;
                        //(function (aCloud) {
                            //myGeo.getPoint(aCloud.location, function(point){
                                //if (point) {
                                    //aCloud.point = point;
                                    //aCloud.marker = new CloudMarker(aCloud.id, point);
                                    //map.addOverlay(aCloud.marker);
                                //}
                                //var marksAllSet = true;
                                //for (var cid in cloudsMap) {
                                    //marksAllSet = marksAllSet && cloudsMap[cid].marker;
                                //}
                                //if (marksAllSet) {
                                    //getUserLocation(viewpoints, function (viewpoint) {
                                        //viewpointSwitcher.setViewpoint(viewpoint); 
                                    //});
                                //}
                            //}, cloud.location);
                        //})(cloud);
                    //}
                //});
            //});
        //}
        //initMap();

        //function showClouds(reports, date) {
            //var date = date.getTime();
            //var report = null;
            //for (var i=0; i < reports.length; ++i) {
                //if (reports[i].at > date) {
                    //report = reports[i - 1];
                    //break;
                //}
            //}
            //if (!report) {
                //report = reports[reports.length - 1];
            //}
            //if (report) {
                //for (var i=0; i < report.statusList.length; ++i) {
                    //var cloudStatus = report.statusList[i];
                    //var cloud = cloudsMap[cloudStatus.id];
                    //cloud.marker.update(cloudStatus.latency);
                //}
            //}
        //}


    //})();
