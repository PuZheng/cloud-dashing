/**
 * Created by Young on 14-2-13.
 */
define(['backbone'], function (Backbone) {
    var TimeSpot = Backbone.Model.extend({
        agent: null,
        latency: 0,
        name: "",
        services:[]
    });
    return TimeSpot;
});
