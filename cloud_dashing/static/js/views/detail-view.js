/**
 * Created by Young on 14-2-21.
 */
/**
 * Created by Young on 14-2-14.
 */
define(['jquery', 'backbone', 'collections/detail-reports', 'common'],
    function ($, Backbone, DetailReports, common) {
        var DetailView = Backbone.View.extend({
            updateViewpoint: function (viewPoint, timespot) {
                var changed = !(this._reports && viewPoint == this._reports.get("agent"));
                if (!!timespot) {
                    var at = timespot.at;
                    if (this._start > at || this._end < at) {
                        changed = true;
                        this._at = at;
                    }
                }

                if (changed) {
                    this._reports = new DetailReports(viewPoint, this._start, this._end);
                    this._reports.fetch({reset: true});
                    this._reports.on("reset", this._updateView, this);
                } else {
                    this._updateView();
                }
            },

            _getNearestTimePoint: function () {
                // 如果没有当前时间点的报告，则用与该时间点最相近的报告
                var _at = this._at;
                var times = _.map(this._reports.models, function (report) {
                    return report.get("at");
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
                debugger;
                var _at = this._getNearestTimePoint();
                var data = _.find(this._reports.models, function (report) {
                    return report.get("at") == _at;
                });
                if (data) {
                    return data;
                } else {
                    return _.first(this._reports.models);
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
                var _reports = this._reports;
                var _renderService = this._renderService;
                if (_reports) {
                    _.each(this._getData(), function (val, key) {
                        columns.push(_renderService(key, val));
                    });
                }
                return $("<tbody></tbody>").append(columns);
            },

            updateTimeSpot: function (data) {
                this.updateViewpoint(this._reports.get("agent"), data);
            },

            _desc: function () {
                return $("<p></p>").text(this._reports.get("agent").get("name") + "服务一览表");
            },
            _updateView: function () {
                this.$el.empty();
                this.$el.append(this._table()).append(this._desc());
                return this;
            }
        });
        return DetailView;
    });