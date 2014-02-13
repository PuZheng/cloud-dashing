define(['backbone', 'views/map-view', 'views/control-panel', 'views/timeline', 
'collections/agents'], 
    function (Backbone, MapView, ControlPanel, Timeline, agents) {
        var AppView = Backbone.View.extend({
            el: '#main',
            initialize: function () {
                agents.fetch({'reset': true}); 
                agents.on('reset', this._render, this);
            },

            _render: function () {
                this._map = new MapView({el: this.$('.map')}).render();
                this._tl = new Timeline({el: this.$('.timeline')});
                this._cp = new ControlPanel({el: this.$('.control-panel')});
                this._tl.on('time-changed', this._cp.updateLatency, this._cp);
                this._tl.on('time-selected', this._map.updateLatency, this._map);
                this._cp.on('viewpoint-set', this._onViewpointSet, this);
                this._cp.on('cloud-toggle', this._onCloudToggle, this);
                this._cp.render();
            },

            _onViewpointSet: function (viewpoint) {
                this._tl.makePlot(viewpoint); 
            },

            _onCloudToggle: function (toggle) {
            
            },

        });
        return AppView;
    });
