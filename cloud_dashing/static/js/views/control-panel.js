define(['jquery', 'backbone', 'handlebars', 'text',
    'collections/agents',
    'text!templates/control-panel.hbs', 'select2'],
    function ($, Backbone, Handlebars, text, agents, controlPanelTemplate) {

        Handlebars.default.registerHelper("compare", function (target, source, options) {
            if (target === source) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        });

        var ControlPanel = Backbone.View.extend({
            _template: Handlebars.default.compile(controlPanelTemplate),

            render: function () {
                this.$el.html(this._template({agents: agents.toJSON()}));
                $('select').select2();
                this._onCloudsSet();
                this._onViewpointSet();
                return this;
            },
            _triggerDom: function (bool, select) {
                if (bool) {
                    this.$(select).show();
                } else {
                    this.$(select).hide();
                }
            },

            triggerCheckClouds: function(bool) {
                this._triggerDom(bool, "#check-clouds");
                if (bool) {
                    $.each(this.$("li.list-group-item"), function (idx, item) {
                        var agent = agents.get($(this).val());
                        agent.set("selected", $(this).attr("data-enabled") === 'true');
                    });
                } else {
                    var selectedAgentId = parseInt($("#select-clouds").val());
                    agents.each(function (agent) {
                        agent.set("selected", agent.id === selectedAgentId);
                    });
                }
            },

            triggerDelayType: function (bool) {
                this._triggerDom(bool, "#delayType");
            },

            triggerSelect: function (bool) {
                this._triggerDom(bool, "#select-div");
            },

            events: {
                'change #viewpoint': '_onViewpointSet',
                'change #delay': '_onDelayTypeSet',
                'change #select-clouds': '_onCloudsSet',
                'click li.list-group-item': function (e) {
                    this._toggleAgent($(e.target));
                },
                'click li.list-group-item i': function (e) {
                    this._toggleAgent($(e.target).parent());
                    return false;
                },
                'click li.list-group-item small': function (e) {
                    this._toggleAgent($(e.target).parent());
                    return false;
                }
            },

            _onCloudsSet: function () {
                var cloud = agents.get(this.$('#select-clouds').val()).toJSON();
                this.$("#cloud-icon").css("color", cloud.color);
                this.trigger("cloud-set", cloud);
                if(this.$('#select-clouds').is(":visible") && this.$("#check-clouds").is(":hidden")) {
                    Backbone.Notifications.trigger("updateCloud", cloud);
                }
            },

            _onViewpointSet: function (e) {
                var viewpoint = agents.get(this.$('#viewpoint').val()).toJSON();
                this.trigger('viewpoint-set', viewpoint);
                this.$("ul li").each(function (index) {
                    if ($(this).attr('data-agent-id') == viewpoint.id) {
                        $(this).hide();
                    } else {
                        $(this).show();
                    }
                });
            },


            _onDelayTypeSet: function () {
                this.trigger('delayType-set', this.$('#delay').val());
            },

            _toggleAgent: function (el) {
                var enabled = !el.attr('data-enabled');
                el.attr('data-enabled', enabled ? 'true' : '');
                el.toggleClass('list-group-item-info', enabled);
                el.toggleClass('text-muted', !enabled);
                el.children('i').toggleClass('fa-check', enabled);
                var square = el.children('i.fa-square');
                if (enabled) {
                    el.css('text-decoration', '');
                    square.css('color', square.attr('data-color'));
                } else {
                    el.css('text-decoration', 'line-through');
                    square.css('color', '#ccc');
                }
                var agent = agents.get(el.val());
                agent.set('selected', enabled);
                this.trigger('agent-toggle', agent.toJSON());
            },

            updateLatency: function (data) {
                if (!data) {
                    this.$('li.list-group-item small').each(function () {
                        $(this).text($(this).text().replace(/-.*/, '- '));
                    });
                } else {
                    this.$('li.list-group-item small').each(function () {
                        $(this).text($(this).text().replace(/-.*/, '- ??'));
                    });
                }
                _.each(data, function (val, i) {
                    if (!val) {
                        return;
                    }
                    var latency = val.get("latency");
                    if (latency === null) {
                        latency = '??';
                    } else if (latency === -1) {
                        latency = '当机';
                    } else {
                        latency += 'ms';
                    }
                    var agentId = val.get('agent').id;
                    var el = this.$('li.list-group-item[data-agent-id=' + agentId + ']').find('small');
                    el.text(el.text().replace(/-.*/, '- ' + latency));
                });
            }
        });

        return ControlPanel;
    });
