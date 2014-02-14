/**
 * Created by Young on 14-2-13.
 */
define(['backbone'], function (Backbone) {
    var TimeSpot = Backbone.Model.extend({
        available: true,
        name: "",
        latency: 0,
        db: "",
        id: ""
    });
    return TimeSpot;
});
