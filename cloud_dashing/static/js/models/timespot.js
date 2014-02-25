/**
 * Created by Young on 14-2-13.
 */
define(['backbone'], function (Backbone) {
    var TimeSpot = Backbone.Model.extend({
        available: true,
        agent:null,
        latency: 0,
        db: "",
        name: "",
        at: 0,
        start: 0,
        end: 0,
    });
    return TimeSpot;
});
