define(['jquery', 'backbone', 'handlebars', 'text!/static/templates/table-view.hbs', 'collections/detail-reports', 'common', 'collections/agents'],
    function ($, Backbone, Handlebars, tableViewTemplate, DetailReports, common, agents) {
        var TableView = Backbone.View.extend({
            _template: Handlebars.default.compile(tableViewTemplate),

            initialize: function () {
                var start = new Date();
                this._start = new Date(start.getFullYear(), start.getMonth(),
                    start.getDate()).getTime();
                this._end = this._start + common.MS_A_DAY;
                Backbone.Notifications.on("time_backward", this._backward, this);
                Backbone.Notifications.on("time_forward", this._forward, this);
            },

            _backward: function (start, end) {
                this._start = start;
                this._end = end;
                this._updateReports();
            },

            _forward: function(start, end) {
                this._start = start;
                this._end = end;
                this._updateReports();
            },

            _renderService: function (name, vals) {
                var th = $("<tr></tr>").append($("<th></th>").attr("rowspan", 2).html(name + '<i class="fa fa-question-circle fa-fw"></i>').addClass("text-center").attr('valign', 'middle').css('vertical-align', 'middle'));
                var tds = [];
                _.each(vals, function (val, key) {
                    th.append($("<th></th>").addClass("text-center").html(key));
                    if (typeof val == 'boolean') {
                        if (val) {
                            val = '是';
                        } else {
                            val = '否';
                        }
                    }
                    var valueColumn = $("<td></td>").addClass("text-center").text(val);
                    tds.push(valueColumn);
                });
                return th.add($("<tr></tr>").append(tds));
            },

            _renderDetail: function (data) {
                var columns = [];
                var that = this;
                _.each(data.get("services"), function (val, key) {
                    columns.push(that._renderService(key, val));
                });
                return $("<tbody></tbody>").append(columns);
            },

            updateTimeSpot: function (data) {
                this.$el.empty();
                if (!!data[0]) {
                    this._at = data[0].get("time") / 1000;
                    this.$el.append(this._template({agent: this._viewpoint}));
                    this.$('table').append(this._renderDetail(data[0]));
                    this._renderReports();
                }
            },

            _renderNetwork: function(value) {
                var th = $("<tr></tr>").attr("id","network").append($("<th></th>").attr("rowspan", 4).html("网络性能" + '<i class="fa fa-question-circle fa-fw"></i>').addClass("text-center").attr('valign', 'middle').css('vertical-align', 'middle'));
                var trs = {};
                if(!!value) {
                    th.append($("<th></th>").addClass("text-center").html("延迟"));
                }
                _.each(value, function (val) {
                    var agent_name = agents.find(function (agent) {
                        return agent.id == val.id;
                    }).get("name");
                    th.append($("<th></th>").addClass("text-center").html(agent_name));
                    _.each(val, function (v, k) {
                        if(k === "id"){
                            return;
                        }
                        if(!(k in trs)){
                            trs[k] = [];
                        }
                        var valueColumn = $("<td></td>").addClass("text-center").html(parseInt(v));
                        trs[k].push(valueColumn);
                    });
                });
                var result = th;
                _.each(trs, function (value, key) {
                    result = result.add($("<tr></tr>").append($("<th></th>").addClass("text-center").html(key + "(ms)")).append(value));
                });
                return result;
            },


            _renderReports: function () {
                if(!!this._reports && !!this._reports.models) {
                    var at = this._at;
                    var current_report = null;
                    var reports = _.sortBy(this._reports.models, function (report) {
                        return report.get("time");
                    });
                    for(var i =0; i< reports.length; i++) {
                        if(reports[i].get("time") >= at) {
                            current_report = reports[i];
                            break;
                        }
                    }
                    if (!!current_report) {
                        this.$("table tbody").append(this._renderNetwork(current_report.get("data")["网络性能"]));
                    }
                }
                return null;
            },

            updateViewpoint: function (viewpoint) {
                this._viewpoint = viewpoint;
                this._updateReports();
            },

            _updateReports: function () {
                this._reports = new DetailReports(this._viewpoint, this._start, this._end);
                this._reports.fetch({"reset": true});
                this._reports.on('reset', this._renderReports, this);
            }

        });
        return TableView;
    });
