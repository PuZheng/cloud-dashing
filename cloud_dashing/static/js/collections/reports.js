define(['jquery', 'backbone', 'underscore', 'models/report', 'collections/agents', 'common'], function ($, Backbone, _, Report, agents, common) {

    var Reports = Backbone.Collection.extend({

        model: Report,

        constructor: function (viewpoint, start, end) {
            this.viewpoint = viewpoint;
            this.start = start;
            this.end = end;
            Backbone.Collection.apply(this, arguments);
        },

        url: function () {
            return 'http://' + common.SERVER_IP + '/api/basic/' + this.viewpoint.id + '?at=' + this.start / 1000 + ',' + this.end / 1000;
        },
    });

    return Reports;
});
