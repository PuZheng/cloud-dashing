define(['jquery', 'backbone', 'handlebars', 'text!/static/templates/table-view.hbs'],
    function ($, Backbone, Handlebars, tableViewTemplate) {
        var TableView = Backbone.View.extend({
            _template: Handlebars.default.compile(tableViewTemplate),
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
                    this.$el.append(this._template({agent: this._viewpoint}));
                    this.$('table').append(this._renderDetail(data[0]));
                }
            },

            _desc: function () {
                return $("<p></p>").text(this._viewpoint.provider + "服务一览表");
            },

            updateViewpoint:  function(viewpoint) {
                this._viewpoint = viewpoint;
            }
        });
        return TableView;
    });
