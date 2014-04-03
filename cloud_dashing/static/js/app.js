define(['views/app-view', 'router/app-router', 'jquery-plugins'], function (AppView, AppRouter, common) {
    var router = new AppRouter();
    var appView = new AppView(router);
    Backbone.history.start();
});
