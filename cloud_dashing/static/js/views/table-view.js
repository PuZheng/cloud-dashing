define(['jquery', 'backbone', 'handlebars', 'views/maskerable-view', 'text!templates/table-view.hbs', 'collections/detail-reports', 'common', 'collections/agents'],
    function ($, Backbone, Handlebars, MaskerableView, tableViewTemplate, DetailReports, common, agents) {
        var TableView = MaskerableView.extend({
            _template: Handlebars.default.compile(tableViewTemplate),

            initialize: function () {
                var start = new Date();
                this._start = new Date(start.getFullYear(), start.getMonth(),
                    start.getDate()).getTime();
                this._end = this._start + common.MS_A_DAY;
                Backbone.Notifications.on("time_backward", this._backward, this);
                Backbone.Notifications.on("time_forward", this._forward, this);
            },

            render: function() {
                this.$el.append(this._template());
                this.maskerView(this.$("table"), $(".mask"));
                return this;
            },

            _backward: function (start, end) {
                this._start = start;
                this._end = end;
                this._updateReports();
            },

            _forward: function (start, end) {
                this._start = start;
                this._end = end;
                this._updateReports();
            },

            _renderService: function (name, vals) {
                var head = $("<th></th>").html(name + '<i class="fa fa-question-circle fa-fw"></i>').addClass("text-center").attr('valign', 'middle').css('vertical-align', 'middle').attr("rowspan", 2);
                var th = $("<tr></tr>").append(head);
                var tds = [];
                _.each(vals, function (val, key) {
                    if (key != '评价') {
                        th.append($("<th></th>").addClass("text-center").html(key));
                        if (typeof val == "string" || typeof val == 'number') {
                            var valueColumn = $("<td></td>").addClass("text-center").text(val);
                            tds.push(valueColumn);
                        } else {
                            var html = "";
                            _.each(val, function (v, k) {
                                html += k + " : " + v + "<br>";
                            });
                            tds.push($("<td></td>").addClass("text-center").html(html));
                        }
                    }
                });
                th.append($("<th></th>").addClass("text-center").html('评价'));
                tds.push($("<td></td>").addClass("text-center").html(vals['评价']));
                return th.add($("<tr></tr>").append(tds));
            },


            updateTimeSpot: function (data) {
                if (!!data[0]) {
                    this._at = data[0].get("time") / 1000;
                    this._renderDetail();
                } else {
                    this.$("table").empty();
                }
            },

            _updateCloudName: function (cloud) {
                this.$("#cloud-name").html(cloud.name + "服务详情表");
            },

            _renderNetwork: function (value) {

                var th = $("<tr></tr>").attr("id", "network").append($("<th></th>").attr("rowspan", 4).html("网络性能" + '<i class="fa fa-question-circle fa-fw"></i>').addClass("text-center").attr('valign', 'middle').css('vertical-align', 'middle'));
                var trs = {};
                if (!!value) {
                    th.append($("<th></th>").addClass("text-center").html("延迟"));
                }
                _.each(value, function (val) {
                    var agent_name = agents.find(function (agent) {
                        return agent.id == val.id;
                    }).get("name");
                    th.append($("<th></th>").addClass("text-center").html(agent_name));
                    _.each(val, function (v, k) {
                        if (k === "id") {
                            return;
                        }
                        if (!(k in trs)) {
                            trs[k] = [];
                        }
                        //var valueColumn = $("<td></td>").addClass("text-center").html(parseInt(v));
                        var valueColumn = $("<td></td>").addClass("text-center").html(v);
                        trs[k].push(valueColumn);
                    });
                });
                var result = th;
                _.each(trs, function (value, key) {
                    result = result.add($("<tr></tr>").append($("<th></th>").addClass("text-center").html(key + "(ms)")).append(value));
                });
                return result;
            },


            _renderDetail: function () {
                this.unmask();
                if (!!this._reports && !!this._reports.models) {
                    this.$("table").empty();
                    var at = this._at;
                    var current_report = null;
                    var reports = _.sortBy(this._reports.models, function (report) {
                        return report.get("time");
                    });
                    for (var i = 0; i < reports.length; i++) {
                        if (reports[i].get("time") >= at) {
                            current_report = reports[i];
                            break;
                        }
                    }
                    if (!!current_report) {
                        this.$("table").append(this._renderService("计算性能", current_report.get("data")[0]["计算性能"]));
                        this.$("table").append(this._renderService("存储性能", current_report.get("data")[0]["存储性能"]));
                        this.$("table").append(this._renderService("网络性能", current_report.get("data")[0]["网络性能"]));
                    }
                }
                return null;
            },

            updateViewpoint: function (viewpoint) {
                this._viewpoint = viewpoint;
                this._updateReports();
            },

            updateCloud: function (cloud) {
                this._cloud = cloud;
                this._updateCloudName(this._cloud);
                this._updateReports();
            },

            _updateReports: function () {
                if (this._viewpoint && this._cloud) {
                    this.mask();
                    this._reports = new DetailReports(this._viewpoint, [this._cloud], this._start, this._end);
                    this._reports.fetch({"reset": true});
                    this._reports.on('reset', this._renderDetail, this);
                }
            }

        });
        return TableView;
    });
