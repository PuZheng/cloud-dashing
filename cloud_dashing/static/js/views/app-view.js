define(['backbone', 'views/map-view'], function (Backbone, MapView) {
    var AppView = Backbone.View.extend({
        el: '#main',
        initialize: function () {
            this.$el.append(new MapView({el: this.$('.map')}).render().el);
        } 
    });
    return AppView;
});
