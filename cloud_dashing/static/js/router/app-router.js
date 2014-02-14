/**
 * Created by Young on 14-2-13.
 */
define(["backbone", "jquery"], function(Backbone, $){
    var AppRouter = Backbone.Router.extend({
        routes: {
            "": "renderMap",
            "map": "renderMap",
            "table": "renderTable",
        },
        renderMap: function () {
            $('.map').show();
            $('.table').hide();
            $(".map-li").addClass("active");
            $(".table-li").removeClass("active");
        },
        renderTable: function () {
            $('.map').hide();
            $('.table').show();
            $(".map-li").removeClass("active");
            $(".table-li").addClass("active");
        }
    });
    return AppRouter;
})