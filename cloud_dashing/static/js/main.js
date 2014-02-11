require.config({
    baseUrl: '/static/components',
    paths: {
        jquery: 'jquery/jquery.min',
        underscore: 'underscore/underscore',
        backbone: 'backbone/backbone-min',
        //functions: '/static/js/functions',
        //utils: '/static/js/utils',
        //viewpointSwitcher: '/static/js/viewpoint-switcher',
        //cloudMarker: '/static/js/cloud-marker',
        //timeline: '/static/js/timeline',
        //dailyAvgLatencyBar: '/static/js/daily-avg-latency-bar',
        'jquery.plot': 'flot/jquery.flot.min',
        'jquery.plot.crosshair': 'flot/jquery.flot.crosshair.min',
        'jquery.plot.time': 'flot/jquery.flot.time.min',
        //'moment': 'moment/min/moment.min',
        'toastr': 'toastr/toastr.min',
        //utils: '/static/js/utils',
        'views/app-view': '/static/js/views/app-view',
        'views/map-view': '/static/js/views/map-view',
    },
    urlArgs: "bust=" + (new Date()).getTime(),
    shim:{
        'jquery.flot': {
            deps: ['jquery'],
            exports:'$.plot'
        },
        'jquery.flot.crosshair': ['jquery.flot'],
        'jquery.flot.time': ['jquery.flot'],
        'toastr': {
            exports: 'toastr',
        },
        'underscore': {
            exports: '_',
        }, 
        'backbone': {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone',
        }
    }
});

requirejs(['/static/js/app.js'])
