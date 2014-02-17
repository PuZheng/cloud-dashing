define(['jquery', 'backbone', 'toastr', 'handlebars', 'common', 'utils', 'collections/daily-reports', 'collections/agents', 'text!/static/templates/avg-daily-latency.hbs', 'jquery.plot', 'jquery.plot.time', 'jquery.plot.tooltip'], 
        function ($, Backbone, toastr, Handlebars, common, utils, DailyReports, agents, avgDailyLatencyTemplate) {
            var AvgDailyLatencyView = Backbone.View.extend({

                _template: Handlebars.default.compile(avgDailyLatencyTemplate),

                initialize: function () {
                    this._start = utils.getMonday(new Date()).getTime();
                    this._end = this._start + common.MS_A_WEEK;
                    toastr.options = {
                        "positionClass": "toast-bottom-full-width",
                        "timeOut": "1000",
                    }
                },
                
                events: {
                    'click .backward-btn': 'moveBack',
                    'click .forward-btn': 'moveForward',
                },

                render: function () {
                    this.$el.html(this._template());
                    this.$container = this.$('.avg-latency');
                    return this; 
                },

                _options: function () {
                    return {
                        xaxis: {
                            mode: 'time',
                            timezone: 'browser',
                            min: this._start - common.MS_A_DAY/2,
                            max: this._end - common.MS_A_DAY/2,
                        },
                        series: {
                            lines: { show: false },
                            points: { show: false }
                        },
                        grid: {
                            clickable: true,
                            hoverable: true,
                            borderWidth: {
                                top: 0,
                                right: 0,
                                bottom: 1,
                                left: 1
                            },
                        },
                        tooltip: true,
                        tooltipOpts: {
                            content: '%y',
                        },
                    };
                },
                
                _renderPlot: function () {
                    var data = [];
                    var seriesMap = {};
                    this._dailyReports.each(function (dailyReport) {
                        for (var i=0; i < dailyReport.get('statusList').length; ++i) {
                            var status_ = dailyReport.get('statusList')[i]
                        if (!(status_.id in seriesMap)) {
                            seriesMap[status_.id] = [];
                        }
                        seriesMap[status_.id].push([dailyReport.get('at'), 
                            status_.latency]);
                        }
                    });
                    for (var id in seriesMap) {
                        var series = seriesMap[id];
                        data.push({
                            data: seriesMap[id],
                            bars: {
                                show: true,
                                fill: true,
                                fillColor: agents.get(id).get('color'),
                                align: 'left',
                            },
                            agentId: id,
                        });
                    }
                    var barWidth = (22 * 60 * 60 * 1000) / data.length;    
                    data.forEach(function (series, i) {
                        series.bars.barWidth = barWidth;
                        series.data = series.data.map(function (point) {
                            return [point[0] - 11 * 60 * 60 * 1000 + i * barWidth, point[1]]
                        });
                    });
                    this._plot = $.plot(this.$container, this._hideDisabledAgents(data), this._options());
                },

                _hideDisabledAgents: function (data) {
                    
                    for (var i=0; i < data.length; ++i) {
                        var series = data[i];
                        var agent = agents.get(series.agentId);
                        var selected = agent.get('selected');
                        series.bars.show = selected;
                    }
                    
                    return data;
                },

                toggleAgent: function (agent) {
                    this._plot = $.plot(this.$container, this._hideDisabledAgents(this._plot.getData()), this._options());
                },

                updateViewpoint: function (viewpoint) {
                    this._viewpoint = viewpoint;
                    this._dailyReports = new DailyReports(this._viewpoint, this._start, this._end);
                    this._dailyReports.fetch({reset: true});
                    this._dailyReports.on('reset', this._renderPlot, this);
                },

                moveBack: function () {
                    this._end = this._start;
                    this._start = this._start - common.MS_A_WEEK;
                    this.updateViewpoint(this._viewpoint);
                },
                
                moveForward: function () {
                    if (this._end >= new Date().getTime()) {
                        toastr.warning('已经是本周了!'); 
                        return;
                    }
                    this._start = this._end;
                    this._end = this._start + common.MS_A_WEEK;
                    this.updateViewpoint(this._viewpoint);
                },
            });
            return AvgDailyLatencyView;
        });
