define(['jquery', 'backbone'],
    function ($, Backbone) {
        var TableView = Backbone.View.extend({
            _table: function (data) {
                return $("<table></table>").addClass("table table-bordered table-condensed").append(this._renderDetail(data));
            },

            _renderService: function (name, vals) {
                var th = $("<tr></tr>").append($("<th></th>").attr("rowspan", 2).text(name).addClass("text-center"));
                var tds = [];
                _.each(vals, function (val, key) {
                    th.append($("<th></th>").addClass("text-center").text(key));
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
                    this.$el.append(this._table(data[0])).append(this._desc());
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