/**
 * Created by Young on 14-2-14.
 * 周服务稳定性统计
 */
define(['views/maskerable-view', 'toastr', 'handlebars', 'collections/daily-reports', 'common', 'utils', 'collections/agents',
    'text!/static/templates/daily-stable-view.hbs'],
    function (MaskerableView, toastr, Handlebars, DailyReports, common, utils, agents, dailyStableViewTemplate) {
        var monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

        var StableTableView = MaskerableView.extend({
            initialize: function (options) {
                this._start = utils.getMonday(new Date()).getTime();
                this._end = this._start + common.MS_A_WEEK;
                toastr.options = {
                    "positionClass": "toast-bottom-full-width",
                    "timeOut": "1000"
                };
                this.maskerView(this.$el, options.mask);
                return this;
            },

            _thead: function () {
                return $("<thead></thead>").append($("<tr class='info'></tr>").append(this._columns()));
            },

            _tbody: function () {
                var data = {};
                var _id = null;
                if (!!this._cloud) {
                    _id = this._cloud.id
                }
                if(!_id) {
                    return;
                }
                data[_id] = {};
                if (this._dailyReports.length) {
                    this._dailyReports.each(function (dailyReport) {
                        var at = dailyReport.get("time");
                        if(!!_id) {
                            data[_id][at] = dailyReport.agentCrashNum(_id);
                        }
                    });
                }
                var dateSpans = this._getDateSpans();
                var dataColumns = _.map(data, function (series, agentId) {
                    var html = $("<tr></tr>");
                    html.append($("<td></td>").addClass("text-center").text(agents.get(agentId).get("name")));
                    _.each(dateSpans, function (date) {
                        var val = series[date.getTime()/1000];
                        var td = $("<td></td>").addClass("text-center");
                        if(val == undefined){
                            td.html("--");
                        }else if (val > 0) {
                            td.html($("<i></i>").addClass("fa fa-frown-o"));
                        } else {
                            td.html($("<i></i>").addClass("fa fa-smile-o"));
                        }
                        html.append(td);
                    });
                    return html;
                });
                return $("<tbody></tbody>").append(dataColumns);
            },

            _getDateSpans: function () {
                var dateSpans = [];
                if (this._start && this._end) {
                    var time = this._start;
                    while (time < this._end) {
                        dateSpans.push(new Date(time));
                        time += common.MS_A_DAY;
                    }
                }
                return dateSpans;
            },

            _columns: function () {
                var columns = [$("<th></th>").text("云").addClass("text-center")];
                _.each(this._getDateSpans(), function (date) {
                    columns.push($("<th></th>").text(monthNames[date.getMonth()] + date.getDate() + '日').addClass("text-center"));
                });
                return columns;
            },

            _renderDetail: function () {
                this.unmask();
                if (this._dailyReports) {
                    this.$el.empty();
                    this.$el.append(this._thead()).append(this._tbody());
                }
            },

            renderReports: function () {
                if (this._viewpoint && this._cloud) {
                    this.mask();
                    this._dailyReports = new DailyReports(this._viewpoint, this._cloud, this._start, this._end);
                    this._dailyReports.fetch({reset: true});
                    this._dailyReports.on('reset', this._renderDetail, this);
                }
            },

            updateViewpoint: function (viewpoint) {
                this._viewpoint = viewpoint;
                this.renderReports();
            },

            updateCloud: function(cloud) {
                this._cloud = cloud;
                this.renderReports();
            },

            moveBack: function () {
                Backbone.Notifications.trigger("toastShow");
                this._end = this._start;
                this._start = this._start - common.MS_A_WEEK;
                this.updateViewpoint(this._viewpoint);
            },

            moveForward: function () {
                if (this._end >= new Date().getTime()) {
                    toastr.warning('已经是本周了!');
                    return;
                }
                Backbone.Notifications.trigger("toastShow");
                this._start = this._end;
                this._end = this._start + common.MS_A_WEEK;
                this.updateViewpoint(this._viewpoint);
            },
            toggleAgent: function () {
                this._renderDetail();
            }
        });

        var StableView = Backbone.View.extend({
            _template: Handlebars.default.compile(dailyStableViewTemplate),

            initialize: function () {
                return this;
            },
            render: function () {
                this.$el.append(this._template());
                this._stableTableView = new StableTableView({el: this.$('.stable-view table'), mask: this.$('.mask')});
                return this;
            },
            updateViewpoint: function (viewpoint) {
                this._stableTableView.updateViewpoint(viewpoint);
            },

            toggleAgent: function (agent) {
                this._stableTableView.toggleAgent();
            },
            events: {
                'click .backward-btn': 'moveBack',
                'click .forward-btn': 'moveForward'
            },
            moveBack: function () {
                this._stableTableView.moveBack();
            },
            moveForward: function () {
                this._stableTableView.moveForward();
            },
            updateCloud: function(cloud) {
                this._stableTableView.updateCloud(cloud);
            },
        });
        return StableView;
    });
