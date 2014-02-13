define(['backbone'], function (Backbone) {
    var Agent = Backbone.Model.extend({
        defaults: {
            name: '',
            location: '',
            color: '',
            selected: true,
        }, 
    });
    return Agent;
});
