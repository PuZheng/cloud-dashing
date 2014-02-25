/**
 * Created by Young on 14-2-21.
 */
define(['backbone'], function (Backbone) {
    var Report = Backbone.Model.extend({
        defaults: {
            at: 0,
        }
    });

    return Report;
});
