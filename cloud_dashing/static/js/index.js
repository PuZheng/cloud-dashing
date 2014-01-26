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
        getViewpoints(function(viewpoints) {
            viewpointSwitcher = new ViewPointSwitcher(viewpoints, map, 
                function(viewpointSwitcher) {
                    var currentTime = new Date();
                    var start = new Date(currentTime.getFullYear(), currentTime.getMonth(), 
                            currentTime.getDate(), 0, 0, 0);
                    var end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
                    getStatusList(viewpointSwitcher.getCurrentViewPoint(), start, end,
                            function (statusList, start) {
                                drawTimeLine($('#timeline'), statusList, start);
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
                                var marker = new BMap.Marker(point);
                                map.addOverlay(marker);
                            }
                        }, cloud.location);
                    })(cloud);
                }
                getUserLocation(viewpoints, function (viewpoint) {
                    viewpointSwitcher.setViewpoint(viewpoint); 
                });
            });
        });
        return map;
    }
    var map = initMap();

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
            }
        }
    }

    drawTimeLine = function(container, reports, start) {
        var data = [];
        var start = start.getTime();
        var seriesMap = {};
        for (var i=0; i < reports.length; ++i) {
            var report = reports[i];
            for (var j=0; j < report.statusList.length; ++j) {
                var cloudStatus = report.statusList[j];
                if (!(cloudStatus.id in seriesMap)) {
                    seriesMap[cloudStatus.id] = [];
                }
                seriesMap[cloudStatus.id].push([report.at - start, cloudStatus.latency]);
            }
        }
        for (var id in seriesMap) {
            var series = seriesMap[id];
            data.push({
                label: cloudsMap[id].name + ' - ' + series[series.length-1][1] + "ms",
                data: seriesMap[id]
            });
        }
		var latestPosition = {x: reports[reports.length-1].at - start, y: null};
        var markedPosition = latestPosition;
        var plot = $.plot(container, data, {
            xaxis: {
                mode: 'time',
            },
            crosshair: {
                mode: "x",
                color: "gray",
                lineWidth: 1
            },
            grid: {
                clickable: true,
                hoverable: true,
                autoHighlight: false,
                borderWidth: {
                    top: 0,
                    right: 0,
                    bottom: 1,
                    left: 1
                },
                markings: function (axes) {
                    return [{
                        yaxis: {
                            from: 1000000,
                            to: 0
                        },
                        lineWidth: 3,
                        xaxis: {
                            from: markedPosition.x,
                            to: markedPosition.x,
                        },
                        color: "red"
                    }]
                },
                margin: {
                    top: 25,
                    right: 10,
                    bottom: 10,
                    left: 10
                } 
            },
        });

        var yaxisLabel = $("<span class='axisLabel yaxisLabel'></span>")
            .text("延迟(ms)")
            .appendTo(container);
        yaxisLabel.css("margin-top", yaxisLabel.width() / 2 - 20);
        var currentTimeTag = $("#currentTime").hide();
        var updating = false;

		function updateTime() {
            updating = false;
			var pos = latestPosition;
			var axes = plot.getAxes();
			if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max ||
				pos.y < axes.yaxis.min || pos.y > axes.yaxis.max) {
				return;
			}
            var date = new Date(pos.x + start);
            currentTimeTag.text(date.getHours() + ":" + date.getMinutes());
            currentTimeTag.css({
                left: pos.pageX,
                top: pos.pageY - 50,
            }).show();
            updateLegends(pos);
		}

        function updateLegends(pos) {
			var i, j, dataset = plot.getData();
			for (i = 0; i < dataset.length; ++i) {
				var series = dataset[i];
				// Find the nearest points, x-wise
                var p = null;
				for (j = 0; j < series.data.length; ++j) {
					if (series.data[j][0] > pos.x) {
                        p = series.data[j - 1];
						break;
					}
				}
				// Now Interpolate
                if (!p) {
                    p = series.data[series.data.length - 1];
                }
				container.find('.legendLabel').eq(i).text(series.label.replace(/-.*/, "- " + p[1] + "ms"));
			}
        }

        container.bind("mouseout", 
                function onMouseOut(e) {
                    currentTimeTag.hide();
                    updateLegends(markedPosition)
                });

		container.bind("plothover",  function (event, pos, item) {
			latestPosition = pos;
            if (!updating) {
                setTimeout(updateTime, 50);
                updating = true;
            }
		});

        container.bind('plotclick', function (event, pos, item){
            var date = new Date(pos.x + start);
            showClouds(reports, date);
            markedPosition = latestPosition;
            plot.draw();
        });
        showClouds(reports, new Date(reports[reports.length - 1].at));
    }

})();
