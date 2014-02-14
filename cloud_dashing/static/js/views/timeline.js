define(['jquery', 'underscore','backbone', 'handlebars', 'text!/static/templates/timeline.hbs', 'collections/reports', 'collections/agents', 'models/timespot', 'common', 'jquery.plot', 'jquery.plot.crosshair',
'jquery.plot.time'],
    function($, _, Backbone, Handlebars, timelineTemplate, Reports, agents, TimeSpot, common) {
        var Timeline = Backbone.View.extend({
            _template: Handlebars.default.compile(timelineTemplate),

            initialize: function () {
                var start = new Date();
                this._start = new Date(start.getFullYear(), start.getMonth(),
                    start.getDate()).getTime();
                this._end = this._start + common.MS_A_DAY;
                this.render();
            },

            events: {
                'plothover .timeline-plot': '_updateTime',
                'mouseout .timeline-plot': function (e) {
                    this._currentTimeTag.hide();
                    this._updateLatency(this._markedPosition)
                },
                'plotclick .timeline-plot': function (e, pos, item) {
                    this._markedPosition = pos;
                    this._plot.draw();
                    //var reports = this._getReportsByX(pos.x);
                    //this.trigger('time-selected', reports[0], reports[1], pos, this);
                },
            },

            render: function () {
                this.$el.html(this._template());
                this.$container = this.$('.timeline-plot');
                this._currentTimeTag = $('<span id="currentTime"></span>').insertBefore(this.$container).hide();
                return this;
            },

            makePlot: function (viewpoint) {
                this._reports = new Reports(viewpoint, this._start, this._end);
                this._reports.fetch({reset: true});
                this._reports.on('reset', this._renderPlot, this);
            },

            _options: function () {
                var that = this;
                return {
                    xaxis: {
                        mode: 'time',
                        min: this._start,
                        max: this._end,
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
                            ret = [];
                            that._reports.each(function (report, i) {
                                for (var j=0; j < report.get('statusList').length; ++j) {
                                    var status_ = report.get('statusList')[j];
                                    var agent = agents.get(status_.id);
                                    if (agent.selected && status_.latency == null) {
                                        var from = null;
                                        if (i == 0) {
                                            from = report.at;
                                        } else {
                                            from = that._reports.get(i-1).at;
                                        }

                                        var to = null;
                                        if (i + 1 < that._reports.length) {
                                            to = that._reports.get(i+1).at;
                                        } else {
                                            to = new Date().getTime();
                                        }
                                        ret.push({
                                            yaxis: {
                                                from: 100000,
                                                to: 0,
                                            },
                                            xaxis: {
                                                from: from,
                                                to: to,
                                            },
                                            color: agent.color,
                                        });
                                    }
                                }
                            });
                            ret.push({
                                yaxis: {
                                    from: 1000000,
                                    to: 0
                                },
                                lineWidth: 1,
                                xaxis: {
                                    from: that._markedPosition.x,
                                    to: that._markedPosition.x,
                                },
                                color: "red"
                            });
                            return ret;
                        },
                        margin: {
                            top: 25,
                            right: 10,
                            bottom: 10,
                            left: 10
                        }
                    },
                }
            },

            _renderPlot: function () {
                this._markedPosition = {
                    x: this._reports.last().get('at'),
                    y: null,
                }
                var data = [];
                var seriesMap = {};
                this._reports.each(function (report) {
                    for (var j=0; j < report.get('statusList').length; ++j) {
                        var agentStatus = report.get('statusList')[j];
                        if (!(agentStatus.id in seriesMap)) {
                            seriesMap[agentStatus.id] = [];
                        }
                        seriesMap[agentStatus.id].push([report.get('at'), agentStatus.latency, agentStatus.available, agentStatus.db]);
                    }
                });
                for (var id in seriesMap) {
                    var series = seriesMap[id];
                    data.push({
                        agentId: id,
                        data: seriesMap[id],
                    });
                }
                this._plot = $.plot(this.$container, this._hideDisabledAgents(data), this._options());
                this._updateTimeSpot(this._markedPosition);
            },

            _hideDisabledAgents: function (data) {
                for (var i=0; i < data.length; ++i) {
                    var series = data[i];
                    var agent = agents.get(series.agentId);
                    var selected = agent.get('selected');
                    series.lines = {show: selected};
                    series.color = selected? agent.get('color'): '#ccc';
                }
                return data;
            },

            _updateTimeSpot: function (pos) {
                var i, j, dataset = this._plot.getData();
                var data = [];
                for (i = 0; i < dataset.length; ++i) {
                    var series = dataset[i];
                    // Find the nearest points, x-wise
                    var point1 = null;
                    var point2 = null;
                    for (j = 0; j < series.data.length; ++j) {
                        if (series.data[j][0] > pos.x) {
                            point1 = series.data[j - 1];
                            point2 = series.data[j];
                            break;
                        } else if (series.data[j][0] == pos.x) {
                            point1 = series.data[j];
                            point2 = series.data[j];
                            break;
                        }
                    }
                    var timespot = null;
                    if (point1) {
                        if (point1[1] && point2[1]) {
                            var agent = _.find(agents.models, function (agent) {
                                return agent.get("id") == series.agentId
                            })
                            var agentName = "";
                            if(agent){
                                agentName = agent.get("name");
                            }
                            if (point1[0] == point2[0]) {
                                timespot = new TimeSpot({id: series.agentId, available: point1[2], latency: Math.floor(point1[1]), db: point1[3], name: agentName})
                            } else {
                                var latency = Math.floor(point1[1] + (point2[1] - point1[1]) * (pos.x - point1[0]) / (point2[0] - point1[0]));
                                timespot = new TimeSpot({id: series.agentId, available: point1[2] && point2[2], latency: latency, db: point1[3] && point2[3], name:agentName})
                            }
                        }
                    }
                    data.push(timespot);
                }
                this.trigger('time-changed', data);
            },

            _updateTime: function (e, pos, item) {
                if (!pos) {
                    return;
                }
                this._updating = false;
                var axes = this._plot.getAxes();
                if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max ||
                pos.y < axes.yaxis.min || pos.y > axes.yaxis.max) {
                    return;
                }
                var date = new Date(pos.x);
                this._currentTimeTag.text(date.getHours() + ":" + date.getMinutes());
                this._currentTimeTag.css({
                    left: pos.pageX,
                    top: pos.pageY - 50,
                }).show();
                this._updateLatency(pos);
            },

            _getReportsByX: function (x) {
                var report1 = null;
                var report2 = null;
                for (var i=0; i < this._reports.length; ++i) {
                    if (this._reports.at(i).at > x) {
                        report1 = this._reports.at(i - 1);
                        report2 = this._reports.at(i);
                        break;
                    } else if (this._reports.at(i).at == x) {
                        report1 = report2 = this._reports.at(i);
                        break;
                    }
                }
                return [report1 && report1.toJSON(), report2 && report2.toJSON()];
            },

            toggleAgent: function (agent) {
                this._plot = $.plot(this.$container, this._hideDisabledAgents(this._plot.getData()), this._options());         
            }
        });
        return Timeline;
    });
