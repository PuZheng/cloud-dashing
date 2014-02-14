define(['jquery', 'backbone', 'backgrid', 'collections/timespots', 'collections/agents', 'models/timespot'], function ($, Backbone, Backgrid, timespots, agents, TimeSpot) {
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
            timespots.reset();
            $.each(data, function (idx, value) {
                timespots.add(value);
            });
            this._timespots = _.clone(timespots);
        },

        toggleAgent: function() {
            timespots.reset();
            $.each(this._timespots.models, function (idx, timespot) {
                $.each(agents.models, function(a_idx, agent){
                    if (agent.get("id") == timespot.get("id") && agent.get("selected")) {
                        timespots.add(timespot);
                    }
                })
            });
        }
    });

    return new TableView({columns: columns,
        collection: timespots});
});
