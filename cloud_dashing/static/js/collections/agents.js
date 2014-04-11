define(['jquery', 'backbone', 'models/agent', 'common'], function ($, Backbone, Agent, common) {
    var Agents = Backbone.Collection.extend({
        model: Agent,
        url: 'http://' + common.SERVER_IP + '/api/cloud-list',
    });

    return new Agents();
});
