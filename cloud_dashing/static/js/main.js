require.config({
    baseUrl: '/static/components',
    paths: {
        jquery: 'jquery/jquery.min',
        underscore: 'underscore/underscore',
        backbone: 'backbone/backbone',
        handlebars: 'handlebars/handlebars.amd.min',
        select2: 'select2/select2.min',
        //functions: '/static/js/functions',
        //utils: '/static/js/utils',
        //viewpointSwitcher: '/static/js/viewpoint-switcher',
        //cloudMarker: '/static/js/cloud-marker',
        //timeline: '/static/js/timeline',
        //dailyAvgLatencyBar: '/static/js/daily-avg-latency-bar',
        'jquery.plot': 'flot/jquery.flot',
        'jquery.plot.crosshair': 'flot/jquery.flot.crosshair',
        'jquery.plot.time': 'flot/jquery.flot.time',
        //'moment': 'moment/min/moment.min',
        'toastr': 'toastr/toastr.min',
        //utils: '/static/js/utils',
        'common': '/static/js/common',
        'views/app-view': '/static/js/views/app-view',
        'views/map-view': '/static/js/views/map-view',
        'views/control-panel': '/static/js/views/control-panel',
        'views/timeline': '/static/js/views/timeline',
        'views/table-view': '/static/js/views/table-view',
        'collections/agents': '/static/js/collections/agents',
        'collections/reports': '/static/js/collections/reports',
        'collections/timespots': '/static/js/collections/timespots',
        'models/agent': '/static/js/models/agent',
        'models/report': '/static/js/models/report',
        'models/timespot': '/static/js/models/timespot',
        'backgrid':'backgrid/lib/backgrid',
        'text': 'text/text',
        'widgets/agent-marker': '/static/js/widgets/agent-marker',
        'router/app-router': '/static/js/router/app-router'
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
        },
        'select2': {
            deps: ['jquery'],
            exports: '$.fn.select2',
        },
        'backgrid':{
            deps:['backbone'],
            exports:'Backgrid'
        }
    }
});

requirejs(['/static/js/app.js'])
