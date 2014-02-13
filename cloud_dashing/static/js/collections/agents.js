define(['jquery', 'backbone', 'models/agent'], function ($, Backbone, Agent) {
    var Agents = Backbone.Collection.extend({
        model: Agent,
        url: 'api/agents',
    });

    return new Agents();
});
