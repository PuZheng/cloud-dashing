define(['handlebars', 'collections/daily-net-reports', 'collections/agents', 'text!/static/templates/avg-daily-latency.hbs', 'views/stat-bar-plot'],
    function (Handlebars, DailyNetReports, agents, avgDailyLatencyTemplate, StatBarPlot) {
        var delayTypes = ["tcp", "udp", "icmp"];

        var AvgDailyLatencyView = StatBarPlot.extend({

            _template: Handlebars.default.compile(avgDailyLatencyTemplate),

            getDailyReports: function () {
                    return new DailyNetReports(this._viewpoint, this._cloud, this._start, this._end);
            },

            container: function () {
                return this.$('.avg-latency');
            },

            _renderPlot: function () {
                if(!this._dailyReports) {
                    return;
                }

                var data = [];
                var seriesMap = {};
                this._dailyReports.each(function (dailyReport) {
                    for (var i = 0; i < dailyReport.get('data').length; ++i) {
                        var status_ = dailyReport.get('data')[i];
                        _.each(delayTypes, function (_type) {
                            if (!(_type in seriesMap)) {
                                seriesMap[_type] = [];
                            }
                            var time = new Date(dailyReport.get('time') * 1000);
                            var date = new Date(time.getFullYear(), time.getMonth(), time.getDate());
                            seriesMap[_type].push([date.getTime(), status_[_type]]);
                        });

                    }
                });
                for (var _type in seriesMap) {
                    data.push({
                        label: _type,
                        data: seriesMap[_type],
                        bars: {
                            show: true,
                        },
                    });
                }
                var barWidth = (22 * 60 * 60 * 1000) / data.length;
                data.forEach(function (series, i) {
                    series.bars.barWidth = barWidth;
                    series.data = series.data.map(function (point) {
                        return [point[0] - 11 * 60 * 60 * 1000 + i * barWidth, point[1]]
                    });
                });
                this._plot = $.plot(this.container(), data, this._options());
                this._hasChanged = false;
            },

            getMaskView: function () {
                return this.$('.mask');
            },

        });
        return AvgDailyLatencyView;
    });
