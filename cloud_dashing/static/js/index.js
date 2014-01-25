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

    function getViewpoints(handler) {
        // TODO not implemented
        handler([
                    {name: "北京", cannonical_name: "北京市"},
                    {name: "上海", cannonical_name: "上海市"}
                ]); 
    }
    var viewpointSwitcher = null;
    getViewpoints(function(viewpoints) {
        viewpointSwitcher = new ViewPointSwitcher(viewpoints, map);   
        map.addControl(viewpointSwitcher);
    });

    getUserLocation(function (viewpoint) {
        viewpointSwitcher.setViewpoint(viewpoint); 
    });

    var currentTime = new Date();
    var start = new Date(currentTime.getFullYear(), currentTime.getMonth(), 
            currentTime.getDate(), 0, 0, 0);
    var end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    getStatusList(viewpointSwitcher.getCurrentViewPoint(), start, end,
            function (cloudList, start) {
                var container = document.getElementById('timeline');
                var options = null;
                var graph = null;
                var x = null, y = null, o = null; 

                var start = start.getTime();
                var data = [];
                for (var i=0; i < cloudList.length; ++i) {
                    var a = [];
                    var cloud = cloudList[i];
                    for (var j = 0; j < cloud.cloudStatusList.length; j++) {
                        var cloudStatus = cloud.cloudStatusList[j];
                        x = cloudStatus.at - start;
                        y = cloudStatus.latency;
                        a.push([x, y]);
                    }
                    data.push({data: a, label: cloud.name});
                }
                options = {
                    xaxis : {
                        mode : 'time', 
                        labelsAngle : 45,
                        noTicks: 48, 
                    },
                    HtmlText : false,
                    mouse : {
                        track           : true, // Enable mouse tracking
                        trackY          : false, // Enable mouse tracking
                        lineColor       : null,
                        relative        : true,
                        position        : 'ne',
                        sensibility     : 1,
                        trackDecimals   : 2,
                        trackFormatter  : function (o) { 
                            var date = new Date(Math.floor(o.x + start));
                            return date.getUTCHours() + ":" + date.getUTCMinutes();
                        }
                    },
                    crosshair : {
                        mode : 'x',
                        color: 'gray',
                    }
                };


                // Draw graph with default options, overwriting with passed options
                function drawGraph (opts) {

                    // Clone the options, so the 'options' variable always keeps intact.
                    o = Flotr._.extend(Flotr._.clone(options), opts || {});

                    // Return a new graph.
                    return Flotr.draw(
                            container,
                            data,
                            o);
                }

                graph = drawGraph();      
                // When graph is clicked, draw the graph with default area.
                Flotr.EventAdapter.observe(container, 'flotr:click', 
                        function (e) { 
                            var date = new Date(Math.floor(e.hit.x + start));
                            // TODO show status
                            
                        });
            }); 
})();
