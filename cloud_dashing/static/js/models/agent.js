define(['backbone'], function (Backbone) {
    var Agent = Backbone.Model.extend({
        defaults: {
            name: '',
            location: '',
        }, 
        parse: function (response) {
            return response;
        }
    });
    return Agent;
});
