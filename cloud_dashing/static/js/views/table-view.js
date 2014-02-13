define(['jquery', 'backbone', 'backgrid', 'collections/timespots'], function ($, Backbone, Backgrid, timespots) {
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
                ["可用", true],
                ["离线", false]
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
                    ["可用", true],
                    ["离线", false]
                ]})
        }
    ];

    var tableView = new Backgrid.Grid({
        columns: columns,
        collection: timespots
    });

    return tableView;
});
