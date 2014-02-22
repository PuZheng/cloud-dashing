/**
 * Created by Young on 14-2-21.
 */
/**
 * Created by Young on 14-2-14.
 */
define(['jquery', 'backbone', 'models/agent-detail', 'common'],
    function ($, Backbone, AgentDetail, common) {
        var DetailView = Backbone.View.extend({
            updateViewpoint: function (viewPoint, timespot) {
                var changed = !(this._agentDetail && viewPoint == this._agentDetail.agent);
                if (!!timespot) {
                    var at = timespot.at;
                    if (this._start > at || this._end < at) {
                        changed = true;
                        this._at = at;
                    }
                }

                if (changed) {
                    this._agentDetail = new AgentDetail({agent: viewPoint, start: this._start, end: this._end});
                    this._agentDetail.fetch();
                    this._agentDetail.on("change", this._updateView, this);
                }
            },

            _getNearestTimePoint: function () {
                // 如果没有当前时间点的报告，则用与该时间点最相近的报告
                var _at = this._at;
                var times = _.map(this._agentDetail.reports, function (report) {
                    return report.at
                });
                times = times.sort();
                for (var i = 0; i < times.length - 1; i++) {
                    if (times[i] == _at) {
                        return _at;
                    } else if (times[i] < _at && times[i + 1] > _at) {
                        if (( _at - times[i]) > (times[i + 1] - _at)) {
                            return times[i + 1];
                        } else {
                            return times[i];
                        }
                    }
                }
                return _at;
            },

            _getData: function () {
                var _at = this._getNearestTimePoint();
                var data = _.find(this._agentDetail.reports, function (report) {
                    return report.at == _at;
                });
                if (data) {
                    return data;
                } else {
                    return _.first(this._agentDetail.reports);
                }

            },

            initialize: function () {
                var start = new Date();
                this._start = new Date(start.getFullYear(), start.getMonth(),
                    start.getDate()).getTime();
                this._end = this._start + common.MS_A_DAY;
            },

            _table: function () {
                return $("<table></table>").addClass("table table-bordered table-condensed").append(this._renderAgentDetail());
            },

            _renderService: function (name, vals) {
                var th = $("<tr></tr>").append($("<th></th>").attr("rowspan", 2).text(name).addClass("text-center"));
                var tds = [];
                _.each(vals, function (val, key) {
                    th.append($("<th></th>").addClass("text-center").text(key));
                    var valueColumn = $("<td></td>").addClass("text-center").text(val);
                    tds.push(valueColumn);
                });
                return th.add($("<tr></tr>").append(tds));
            },

            _renderAgentDetail: function () {
                var columns = [];
                var _agentDetail = this._agentDetail;
                var _renderService = this._renderService;
                if (_agentDetail) {
                    _.each(this._getData(), function (val, key) {
                        columns.push(_renderService(key, val));
                    });
                }
                return $("<tbody></tbody>").append(columns);
            },

            updateTimeSpot: function (data) {
                this.updateViewpoint(this._agentDetail.agent, data);
            },

            _desc: function () {
                return $("<p></p>").text(this._agentDetail.agent.name + "服务一览表");
            },
            _updateView: function () {
                this.$el.empty();
                this.$el.append(this._table()).append(this._desc());
                return this;
            }
        });
        return DetailView;
    });