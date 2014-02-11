define(['backbone', 'views/map-view', 'views/control-panel'], 
        function (Backbone, MapView, ControlPanel) {
            var AppView = Backbone.View.extend({
                el: '#main',
                initialize: function () {
                    new MapView({el: this.$('.map')}).render();
                    new ControlPanel({el: this.$('.control-panel')}).render();
                } 
            });
            return AppView;
        });
