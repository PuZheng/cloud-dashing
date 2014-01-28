(function () {
    TimeLine = function (container) {
        this._container = container;

        require(
            [
            'echarts',
            'echarts/chart/line',   
            'echarts/chart/bar'
            ],
            function (ec) {
                var myChart = ec.init(domMain);
                var option = {
                }
                myChart.setOption(option);
            }
            );
    }

    TimeLine.prototype.draw = function (reports, start, end) {

    }
})();


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
            label: id + "." + cloudsMap[id].name + ' - ' + series[series.length-1][1] + "ms",
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
}
