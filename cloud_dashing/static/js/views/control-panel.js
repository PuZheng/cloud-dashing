define(['jquery', 'backbone', 'handlebars', 'text', 'collections/agents', 
       'text!/static/templates/control-panel.hbs', 'select2'], 
        function ($, Backbone, Handlebars, text, Agents, controlPanelTemplate) {

            var ControlPanel = Backbone.View.extend({
                _template: Handlebars.default.compile(controlPanelTemplate),
                
                initialize: function () {
                    this.collection = new Agents();
                    this.collection.on('reset', this.render, this);
                    this.collection.fetch({reset: true});
                },

                render: function () {
                    this.$el.html(this._template({agents: this.collection.toJSON()}));
                    $('select').select2();
                }, 
            });

            return ControlPanel;
        });
