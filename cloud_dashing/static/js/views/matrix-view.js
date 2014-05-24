(function (mods) {
    define(mods, function (Backbone, handlebars, agents, matrixTemplate, common, 
            DetailReports) {
        var MatrixView = Backbone.View.extend({
            _template: handlebars.default.compile(matrixTemplate),
            render: function () {
                var start = new Date();
                this._start = new Date(start.getFullYear(), start.getMonth(),
                    start.getDate()).getTime();
                this._end = this._start + common.MS_A_DAY;
                Backbone.Notifications.on("time_backward", this._backward, this);
                Backbone.Notifications.on("time_forward", this._forward, this);
                this._clouds = agents.chain().filter(function(agent) {
                    return agent.get('type') != 1
                }).sortBy(function (agent) { 
                    return agent.get('id');
                }).map(function (agent) {
                    return agent.toJSON();
                }).value();
                this.$el.html(this._template({agents: agents}));
                return this;
            },

            toggleAgent: function (agents) {
                agents.forEach(function (agent) {
                    console.log('toggle agent ' + agent.get('name'));
                    this.$('tr[data-id="' + agent.get('id') + '"]').toggle(agent.get('selected'));
                }.bind(this));
            },

            updateViewpoint: function (viewpoint) {
                this._viewpoint = viewpoint;
                this._updateReports();
            },

            _updateReports: function () {
                this._reports = new DetailReports(this._viewpoint, 
                        this._clouds.filter(function (cloud) {
                            return cloud.id != this._viewpoint.id;
                        }, this), 
                        this._start, 
                        this._end);
                this._reports.fetch({"reset": true});
                this._reports.on('reset', this._renderTable, this);
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

            updateTimeSpot: function (data) {
                if (!!data[0]) {
                    this._at = data[0].get("time") / 1000;
                    this._renderTable();
                } else {
                    this.$("tbody").empty();
                }
            },

            _renderTable: function () {
                if (!!this._reports && !!this._reports.models) {
                    var at = this._at;
                    var current_report;
                    var reports = _.sortBy(this._reports.models, function (report) {
                        return report.get("time");
                    });
                    for (var i = 0; i < reports.length; i++) {
                        if (reports[i].get("time") >= at) {
                            current_report = reports[i];
                            break;
                        }
                    }
                    var cloudId2Name = {};
                    this._clouds.forEach(function (cloud) {
                        cloudId2Name[cloud.id] = cloud.name;
                    });
                    if (!!current_report) {
                        this.$('tbody').empty();
                        current_report.get('data').forEach(function (subReport) {
                            var s = '<tr data-id="' + subReport.id + '">';
                            s += '<td>' + subReport.id + '</td>';
                            s += '<td>' + cloudId2Name[subReport.id] + '</td>';
                            ['udp', 'http', 'tcp', 'icmp', '评价'].forEach(
                                function (p) {
                                    if (!!subReport['网络性能']) {
                                        s += '<td>' + subReport['网络性能'][p] + '</td>';
                                    } else {
                                        s += '<td>--</td>';
                                    }
                                });
                            s += '</tr>';
                            this.$('tbody').append(s);
                        });
                    }
                }
            },
        });
        return MatrixView;
    });
})(['backbone', 'handlebars', 'collections/agents', 'text!templates/matrix.hbs',
    'common', 'collections/detail-reports']);
