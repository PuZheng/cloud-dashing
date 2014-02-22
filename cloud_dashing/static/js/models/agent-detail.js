/**
 * Created by Young on 14-2-21.
 */
define(['backbone'], function (Backbone) {
    var AgentDetail = Backbone.Model.extend({
        initialize: function (args) {
            this.agent = args.agent;
            this.start = args.start;
            this.end = args.end;
            this.url = "/basic/" + this.agent.id + "?start=" + this.start + "&end=" + this.end + "&features=cpu,hd";
            this.reports = {};
        },
        parse: function (resp, options) {
            var reports = this.reports;
            _.each(resp, function (val, key) {
                reports[val.at] = val.basic;
            });
            return resp;
        }
    });
    return AgentDetail;
});
