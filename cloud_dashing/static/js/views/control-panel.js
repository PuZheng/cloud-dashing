define(['jquery', 'backbone', 'handlebars', 'text', 
    'collections/agents', 
    'text!/static/templates/control-panel.hbs', 'select2'], 
    function ($, Backbone, Handlebars, text, agents, controlPanelTemplate) {

        var ControlPanel = Backbone.View.extend({
            _template: Handlebars.default.compile(controlPanelTemplate),

            render: function () {
                this.$el.html(this._template({agents: agents.toJSON()}));
                $('select').select2();
                this._onViewpointSet();
                return this;
            }, 

            events: {
                'change select': '_onViewpointSet',
                'click ul li': '_toggleCloud',
            },

            _onViewpointSet: function (e) {
                this.trigger('viewpoint-set', agents.get(this.$('select').val()).toJSON());
            },

            _toggleCloud: function (e) {
                var el = $(e.target);
                var enabled = !el.attr('data-enabled');
                el.attr('data-enabled', enabled? 'true': '');
                el.toggleClass('list-group-item-success', enabled);
                el.toggleClass('text-muted', !enabled);
                el.children('i').toggleClass('fa-check', enabled);
                if (enabled) {
                    el.css('text-decoration', '');
                } else {
                    el.css('text-decoration', 'line-through');
                }
                this.trigger('cloud-toggle', enabled);
            },

            updateLatency: function (data) {
                _.each(data, function (latency, i) {
                    this.$('ul li').eq(i).find('small').text(latency? latency + 'ms': '??');
                });
            }
        });

        return ControlPanel;
    });
