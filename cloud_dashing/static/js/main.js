require.config({
    baseUrl: '/static/components',
    paths: {
        jquery: 'jquery/jquery.min',
        underscore: 'underscore/underscore',
        backbone: 'backbone/backbone',
        handlebars: 'handlebars/handlebars.amd.min',
        select2: 'select2/select2.min',
        bootstrap: 'bootstrap/dist/js/bootstrap.min',
        //functions: '/static/js/functions',
        utils: '/static/js/utils',
        //viewpointSwitcher: '/static/js/viewpoint-switcher',
        //cloudMarker: '/static/js/cloud-marker',
        //timeline: '/static/js/timeline',
        //dailyAvgLatencyBar: '/static/js/daily-avg-latency-bar',
        'jquery.plot': 'flot/jquery.flot',
        'jquery.plot.crosshair': 'flot/jquery.flot.crosshair',
        'jquery.plot.time': '/static/js/misc/jquery.flot.time',
        'jquery.plot.tooltip': 'flot.tooltip/js/jquery.flot.tooltip.min',
        //'moment': 'moment/min/moment.min',
        'toastr': 'toastr/toastr.min',
        //utils: '/static/js/utils',
        'common': '/static/js/common',
        'views/app-view': '/static/js/views/app-view',
        'views/map-view': '/static/js/views/map-view',
        'views/control-panel': '/static/js/views/control-panel',
        'views/timeline': '/static/js/views/timeline',
        'views/table-view': '/static/js/views/table-view',
        'views/stat-view': '/static/js/views/stat-view',
        'views/avg-daily-latency': '/static/js/views/avg-daily-latency',
        'collections/agents': '/static/js/collections/agents',
        'collections/reports': '/static/js/collections/reports',
        'collections/timespots': '/static/js/collections/timespots',
        'collections/daily-reports': '/static/js/collections/daily-reports',
        'models/agent': '/static/js/models/agent',
        'models/report': '/static/js/models/report',
        'models/timespot': '/static/js/models/timespot',
        'models/daily-report': '/static/js/models/daily-report',
        'backgrid':'backgrid/lib/backgrid',
        'text': 'text/text',
        'widgets/agent-marker': '/static/js/widgets/agent-marker',
        'router/app-router': '/static/js/router/app-router'
    },
    urlArgs: "bust=" + (new Date()).getTime(),
    shim: {
        'jquery.plot': {
            deps: ['jquery'],
            exports:'$.plot'
        },
        'jquery.plot.crosshair': ['jquery.plot'],
        'jquery.plot.time': ['jquery.plot'],
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
        'bootstrap': {
            deps: ['jquery'],
            exports: '$.fn.tooltip',
        },
        'select2': {
            deps: ['jquery'],
            exports: '$.fn.select2',
        },
        'backgrid':{
            deps:['backbone'],
            exports:'Backgrid'
        }
    },
});

requirejs(['/static/js/app.js'])
