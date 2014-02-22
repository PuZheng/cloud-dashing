define(['jquery', 'backbone', 'backgrid', 'collections/timespots', 'collections/agents'], function ($, Backbone, Backgrid, timespots, agents) {
    var columns = [
        {
            name: "name",
            label: "云",
            editable: false,
            cell: "string"
        },
        {
            name: "available", label: "状态", editable: false, cell: Backgrid.SelectCell.extend({
            // It's possible to render an option group or use a
            // function to provide option values too.
            optionValues: [
                ["<i class='fa-check fa' />", true],
                ["<i class='fa-times fa text-danger' />", false]
            ]
        })
        },
        {
            name: "latency",
            label: "延迟（ms）",
            editable: false,
            cell: "string"
        },
        {
            name: "db",
            label: "存储",
            editable: false,
            cell: Backgrid.SelectCell.extend({
                // It's possible to render an option group or use a
                // function to provide option values too.
                optionValues: [
                    ["<i class='fa-check fa' />", true],
                    ["<i class='fa-times fa text-danger' />", false]
                ]})
        }
    ];

    var TableView = Backgrid.Grid.extend({
        updateStatus: function (data) {
            this._data = data;
            this._updateView();
        },
        toggleAgent: function(){
            this._updateView();
        },
        _updateView: function () {
            if (this._data) {
                timespots.reset();
                $.each(this._data, function (idx, value) {
                    if (value && value.get("agent").get("selected")) {
                        timespots.add(value);
                    }
                });
            }
        }
    });

    return new TableView({columns: columns,
        collection: timespots});
});
