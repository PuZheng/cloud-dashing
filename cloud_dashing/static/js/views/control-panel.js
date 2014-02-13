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
                'click li.list-group-item': '_toggleAgent',
            },

            _onViewpointSet: function (e) {
                this.trigger('viewpoint-set', agents.get(this.$('select').val()).toJSON());
            },

            _toggleAgent: function (e) {
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
                var agent = agents.get(el.val());
                agent.set('selected', enabled);
                this.trigger('agent-toggle', agent.toJSON());
            },

            updateLatency: function (data) {
                _.each(data, function (val, i) {
                    var latency = val.get("latency");
                    if (latency === null) {
                        latency = '??';
                    } else if (latency === -1) {
                        latency = '当机';
                    } else {
                        latency += 'ms';
                    }
                    var el = this.$('li.list-group-item').eq(i);
                    el.text(el.text().replace(/-.*/, '- ' + latency));
                });
            }
        });

        return ControlPanel;
    });
