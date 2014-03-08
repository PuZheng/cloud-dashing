/**
 * Created by Young on 14-2-13.
 */
define(["backbone", "jquery"], function(Backbone, $){
    var AppRouter = Backbone.Router.extend({
        routes: {
            "*filter": 'filter',
        },
    });
    return AppRouter;
})
