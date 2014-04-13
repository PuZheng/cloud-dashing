define(['views/maskerable-view', 'handlebars', 'jquery', 'text!templates/timeline.hbs',
    'collections/reports', 'collections/agents', 'models/timespot', 'common', 'utils', 'toastr',
    'jquery.plot', 'jquery.plot.crosshair', 'jquery.plot.symbol', 'jquery.plot.time'],
    function (MaskerableView, Handlebars, $, timelineTemplate, Reports, agents, TimeSpot, common, utils, toastr) {
        var delayType = ["tcp", "udp", "icmp"];
        // 暂时不能动态生成

        var Timeline = MaskerableView.extend({
            _template: Handlebars.default.compile(timelineTemplate),

            initialize: function () {
                var start = new Date();
                this._start = new Date(start.getFullYear(), start.getMonth(),
                    start.getDate()).getTime();
                this._end = this._start + common.MS_A_DAY;
                toastr.options = {
                    "positionClass": "toast-bottom-full-width",
                    "timeOut": "1000"
                };
                this._playing = false;
                this.render();
                Backbone.Notifications.on("updateCloud", this._updateCloud, this);
            },

            events: {
                'plothover .timeline-plot': '_updateTime',
                'mouseout .timeline-plot': function (e) {
                    this._currentTimeTag.hide();
                    this._updateTimeSpot(this._markedPosition)
                },
                'plotclick .timeline-plot': function (e, pos, item) {
                    this._markedPosition = pos;
                    this._plot.draw();
                },
                'click .mode-btn': '_changeMode',
                'click .backward-btn': '_backward',
                'click .forward-btn': '_forward',
                'click .play-btn': '_playPause'
            },

            render: function () {
                this.$el.append(this._template());
                this.$container = this.$('.timeline-plot');
                this.maskerView(this.$('.timeline-view'), this.$('.mask'));
                this._currentTimeTag = $('<span id="currentTime"></span>').insertBefore(this.$container).css({position: 'absolute'}).hide();
                return this;
            },

            makePlot: function (viewpoint, initDate) {
                if (this._viewpoint != viewpoint || this._hasChanged == true) {
                    this._viewpoint = viewpoint;
                    if (!!initDate) {
                        this._initTime = initDate.getTime();
                    } else if (!!this._markedPosition) {
                        this._initTime = this._markedPosition;
                    }
                    this.mask();
                    this._reports = new Reports(viewpoint, this._start, this._end);
                    this._reports.fetch({reset: true});
                    this._reports.on('reset', this._renderPlot, this);
                } else {
                    this._renderPlot();
                }
            },

            _options: function (max) {
                var that = this;
                var ticks = [];
                var step = this._maxLatency > 1000? 100: (this._maxLatency > 500? 50: 25);
                var i = 0; 
                for (i = 0; i < this._maxLatency && i < 1000; i += step) {
                    ticks.push(i); 
                }
                if (this._maxLatency >= 1000) {
                    for (i = 1000; i < this._maxLatency; i += 1000) {
                        ticks.push(i);
                    }
                }
                ticks.push(i);
                return {
                    xaxis: {
                        mode: 'time',
                        timezone: 'browser',
                        min: this._start,
                        max: this._end,
                    },
                    yaxis: {
                        tickFormatter: (function (val, axis) {
                            if (this._maxLatency < 1000 || val >= 1000 || val % 200 === 0) {
                                return val + '(ms)';
                            }
                            return '';
                        }).bind(this),
                        ticks: ticks,
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
                                for (var j = 0; j < report.get('data').length; ++j) {
                                    var status_ = report.get('data')[j];
                                    var agent = agents.get(status_.id);
                                    if (agent.selected && status_.latency == null) {
                                        var from = null;
                                        if (i == 0) {
                                            from = report.time * 1000;
                                        } else {
                                            from = that._reports.get(i - 1).time * 1000;
                                        }

                                        var to = null;
                                        if (i + 1 < that._reports.length) {
                                            to = that._reports.get(i + 1).time * 1000;
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
                this.unmask();
                this._markedPosition = {
                    x: this._reports.last().get('time') * 1000,
                    y: null,
                }
                if (!!this._initTime && this._getMode() === 'week' && this._markedPosition.x > this._initTime) {
                    this._markedPosition.x = this._initTime
                }
                this._initTime = this._markedPosition.x;
                var data = [];
                var lineSeriesMap = {};
                var pointSeriesMap = {};
                var _reportsSize = this._reports.models.length;

                function getLatency(report, agentId, type) {
                    var netStatus = report.get("data")["网络性能"];
                    var agentStatus = _.find(netStatus, function (status) {
                        return status.id == agentId;
                    });
                    if (!!agentStatus) {
                        return  parseFloat(agentStatus[type]);
                    }
                    return null;
                }

                for (var i = 0; i < _reportsSize; i++) {
                    var _reports = this._reports.models;
                    var report = this._reports.models[i];
                    var allNetStatus = report.get('data')["网络性能"];
                    if (!!allNetStatus) {
                        _.each(allNetStatus, function (val, key) {
                            key = parseInt(key);
                            _.each(delayType, function (type) {
                                var latency = parseFloat(val[type]);

                                if (!(type in lineSeriesMap)) {
                                    lineSeriesMap[type] = {};
                                }
                                if (!(type in pointSeriesMap)) {
                                    pointSeriesMap[type] = {};
                                }
                                if (val["crashed"] === 0) {
                                    if (!(key in lineSeriesMap[type])) {
                                        lineSeriesMap[type] [key] = {
                                            maxLatency: 0,
                                            data: [],
                                        };
                                    }
                                    lineSeriesMap[type][key].data.push([report.get('time') * 1000, latency]);
                                    if (lineSeriesMap[type][key].maxLatency < latency) {
                                        lineSeriesMap[type][key].maxLatency = latency;
                                    }
                                } else {
                                    if (!(key in pointSeriesMap[type])) {
                                        pointSeriesMap[type][key] = [];
                                    }

                                    if (i < _reportsSize - 1) {
                                        var nextVal = getLatency(_reports[i + 1], val.id, type);
                                    }
                                    if (i > 0) {
                                        var preVal = getLatency(_reports[i - 1], val.id, type);
                                    }
                                    if (nextVal && preVal) {
                                        latency = (nextVal + preVal) / 2;
                                    } else {
                                        latency = nextVal || preVal;
                                    }
                                    pointSeriesMap[type][key].push([report.get('time') * 1000, latency, "crashed"]);
                                }
                            });

                        });
                    }
                }
                for (var type in lineSeriesMap) {
                    for (var id in lineSeriesMap[type]) {
                        data.push({
                            type: type,
                            agentId: id,
                            data: lineSeriesMap[type][id].data,
                            dataType: "lines",
                            maxLatency: lineSeriesMap[type][id].maxLatency,
                        });
                    }
                }
                for (var type in pointSeriesMap) {
                    for (var id in pointSeriesMap[type]) {
                        data.push({
                            type: type,
                            agentId: id,
                            data: pointSeriesMap[type][id],
                            dataType: "points"
                        });
                    }
                }
                this._plotData = data;
                this._plot = $.plot(this.$container, this._hideDisabledAgents(), this._options());
                this._updateTimeSpot(this._markedPosition);
                this._hasChanged = false;
            },

            _hideDisabledAgents: function () {
                var data = [];
                if (!!this._plotData) {
                    this._maxLatency = 0;
                    for (var i = 0; i < this._plotData.length; ++i) {
                        var series = this._plotData[i];
                        if (series.type === this._type) {
                            var agent = agents.get(series.agentId);
                            var selected = agent.get('selected');
                            if (selected) {
                                if (series.dataType == "lines") {
                                    series.lines = {show: selected};
                                    series.color = selected ? agent.get('color') : '#ccc';
                                    if (series.maxLatency > this._maxLatency) {
                                        this._maxLatency = series.maxLatency; 
                                    }
                                } else if (series.dataType == "points") {
                                    series.points = {show: selected, symbol: "cross"};
                                    series.color = "red";
                                }
                                data.push(series);
                            }
                        }
                    }
                }
                return data;
            },

            _updateTimeSpot: function (pos) {
                function unionDataset(dataset, type) {
                    var newDataset = {};
                    _.forEach(dataset, function (series) {
                        if (!(series.agentId in newDataset)) {
                            newDataset[series.agentId] = [];
                        }
                        if (series.type === type) {
                            var data = _.union(newDataset[series.agentId], series.data);
                            newDataset[series.agentId] = _.sortBy(data, function (val) {
                                return val[0];
                            });
                        }
                    });
                    return newDataset;
                }

                function Point(data) {
                    if (!!data) {
                        this.x = data[0];
                        this.latency = data[1];
                        this.crashed = data[4] || false;
                    }
                }

                var i, j, dataset = this._plot.getData();
                var newDataSet = unionDataset(dataset, this._type);
                var data = [];
                _.each(newDataSet, function (value, idx) {
                    // Find the nearest points, x-wise
                    var point1 = null;
                    var point2 = null;
                    for (j = 0; j < value.length; ++j) {
                        if (value[j][0] > pos.x) {
                            point1 = new Point(value[j - 1]);
                            point2 = new Point(value[j]);
                            break;
                        } else if (value[j][0] == pos.x) {
                            point1 = new Point(value[j]);
                            point2 = new Point(value[j]);
                            break;
                        }
                    }
                    var timespot = null;
                    if (point1 && point2 && point1.latency && point2.latency) {
                        var agent = _.find(agents.models, function (agent) {
                            return agent.get("id") == idx
                        });
                        var agentName = "";
                        if (agent) {
                            agentName = agent.get("name");
                        }
                        var latency = Math.floor(point1.latency);
                        if (point1.x != point2.x) {
                            latency = Math.floor(point1.latency + (point2.latency - point1.latency) * (pos.x - point1.x) / (point2.x - point1.x));
                        }
                        if (point1.crashed || point2.crashed) {
                            latency = -1
                        }
                        timespot = new TimeSpot({
                            time: point1.x,
                            agent: agent,
                            latency: latency,
                            name: agentName
                        });
                    }
                    data.push(timespot);
                });
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
                this._currentTimeTag.offset({
                    left: pos.pageX,
                    top: pos.pageY - 50,
                }).show();
                this._updateTimeSpot(pos);
            },

            _getReportsByX: function (x) {
                var report1 = null;
                var report2 = null;
                for (var i = 0; i < this._reports.length; ++i) {
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

            toggleAgent: function () {
                this._plot = $.plot(this.$container, this._hideDisabledAgents(), this._options());
            },

            _getMode: function () {
                return this.$(".mode-btn").text() === '日' ? 'day' : 'week';
            },

            _changeMode: function (e) {
                if (this._getMode() === 'day') {
                    this.$('.mode-btn').text('周');
                    this._start = utils.getMonday(this.getCurrentDate()).getTime();
                    this._end = this._start + common.MS_A_WEEK;
                } else {
                    this.$('.mode-btn').text('日');
                    var start = this.getCurrentDate();
                    this._start = new Date(start.getFullYear(), start.getMonth(),
                        start.getDate()).getTime();
                    this._end = this._start + common.MS_A_DAY;
                }
                // keep the current date
                this.pause();
                this._hasChanged = true;
                this.makePlot(this._viewpoint, this.getCurrentDate());
            },

            getCurrentDate: function () {
                return new Date(this._markedPosition.x);
            },

            _backward: function (e) {
                Backbone.Notifications.trigger("toastShow");
                if (this._getMode() == 'day') {
                    var start = new Date(this._start - common.MS_A_DAY);
                    this._start = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
                    this._end = this._start + common.MS_A_DAY;
                } else {
                    this._start = new Date(utils.getMonday(this._start - common.MS_A_WEEK)).getTime();
                    this._end = this._start + common.MS_A_WEEK;
                }
                Backbone.Notifications.trigger("time_backward", this._start, this._end);
                this.pause();
                this._hasChanged = true;
                this.makePlot(this._viewpoint);
            },

            _forward: function (e) {
                if (this._getMode() == 'day') {
                    var today = new Date();
                    today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    if (new Date(this._start) >= today) {
                        toastr.warning('已经是今天了!');
                        return;
                    }
                    var start = new Date(this._start + common.MS_A_DAY);
                    this._start = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
                    this._end = this._start + common.MS_A_DAY;
                } else {
                    if (new Date(this._start) >= utils.getMonday(new Date())) {
                        toastr.warning('已经是最后一周了!');
                        return;
                    }
                    this._start = new Date(utils.getMonday(this._start + common.MS_A_WEEK)).getTime();
                    this._end = this._start + common.MS_A_WEEK;
                }
                Backbone.Notifications.trigger("toastShow");
                Backbone.Notifications.trigger("time_backward", this._start, this._end);
                this.pause();
                this._hasChanged = true;
                this.makePlot(this._viewpoint);
            },

            pause: function (e) {
                clearInterval(this._ti);
                this._playing = false;
                this.$('.play-btn i').removeClass('fa-pause').addClass('fa-play');
            },

            _playPause: function (e) {
                if (!this._playing) {
                    var pivot = this._markedPosition.x;
                    for (var reportIdx = 0;
                         reportIdx < this._reports.length && this._reports.at(reportIdx).get('at') < pivot;
                         ++reportIdx) {
                    }
                    var that = this;
                    this._ti = setInterval(
                        function () {
                            reportIdx = (reportIdx + 1) % that._reports.length;
                            var report = that._reports.at(reportIdx);
                            that._displayReport(report.toJSON());
                        }, 500);
                    this.$('.play-btn i').removeClass('fa-play').addClass('fa-pause');
                } else {
                    this.$('.play-btn i').removeClass('fa-pause').addClass('fa-play');
                    clearInterval(this._ti);
                }
                this._playing = !this._playing;
            },

            _displayReport: function (report) {
                this._markedPosition.x = report.time * 1000;
                this._plot.draw();
                var date = new Date(this._markedPosition.x);
                this._currentTimeTag.text(date.getHours() + ":" + date.getMinutes());
                this._currentTimeTag.offset({
                    left: this._plot.pointOffset({x: this._markedPosition.x, y: 0}).left + this.$container.offset().left,
                    top: this._plot.offset().top + this._plot.height() / 2
                }).show();
                var data = [];
                var that = this;

                for (agentId in report.data['网络性能']) {
                    var netStatus = report.data['网络性能'][agentId];
                    var agent = _.find(agents.models, function (agent) {
                        return agent.get("id") == agentId;
                    });
                    if (!!agent) {
                        data.push(new TimeSpot({
                            time: that._markedPosition.x,
                            agent: agent,
                            latency: parseInt(netStatus[this._type]),
                            name: agent.get("name") || ""
                        }));
                    }
                }
                this.trigger('time-changed', data);
            },

            updateDelayType: function (type) {
                this._type = type;
                this._plot = $.plot(this.$container, this._hideDisabledAgents(), this._options());
                this._updateTimeSpot(this._markedPosition);
                this.pause();
                this._hasChanged = true;
            },

            _updateCloud: function(cloud) {
                this.pause();
                this._hasChanged = true;
                agents.each(function (agent) {
                    agent.set("selected", agent.id === cloud.id);
                });
                this._plot = $.plot(this.$container, this._hideDisabledAgents(), this._options());
            }
        });
        return Timeline;
    });
