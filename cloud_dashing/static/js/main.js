require.config({
    baseUrl: 'static',
    paths: {
        /* 3rd party */
        jquery: ['//cdn.staticfile.org/jquery/2.1.1-beta1/jquery.min', 'components/jquery/jquery.min'],
        'jquery-map': ['//cdn.staticfile.org/jquery/2.1.1-beta1/jquery.min.map', 'components/jquery/jquery.min.map'],
        underscore: ['//cdn.staticfile.org/underscore.js/1.6.0/underscore-min', 'components/underscore/underscore'],
        kineticjs: ['//cdn.staticfile.org/kineticjs/5.0.1/kinetic.min', 'components/kineticjs/kinetic.min'],
        backbone: ['//cdn.staticfile.org/backbone.js/1.1.2/backbone-min', 'components/backbone/backbone'],
        handlebars: ['//cdn.staticfile.org/handlebars.js/1.3.0/handlebars.amd.min', 'components/handlebars/handlebars.amd.min'],
        select2: ['//cdn.staticfile.org/select2/3.4.6/select2.min', 'components/select2/select2.min'],
        bootstrap: ['//cdn.staticfile.org/twitter-bootstrap/3.1.1/js/bootstrap.min', 'components/bootstrap/dist/js/bootstrap.min'],
        'jquery.plot': ['//cdn.staticfile.org/flot/0.8.2/jquery.flot.min', 'components/flot/jquery.flot'],
        'jquery.plot.crosshair': ['//cdn.staticfile.org/flot/0.8.2/jquery.flot.crosshair.min', 'components/flot/jquery.flot.crosshair'],
        'jquery.plot.tooltip': 'components/flot.tooltip/js/jquery.flot.tooltip.min',
        'jquery.plot.symbol': ['//cdn.staticfile.org/flot/0.8.2/jquery.flot.symbol.min', 'components/flot/jquery.flot.symbol'],
        'moment': ['//cdn.staticfile.org/moment.js/2.5.1/moment.min', 'components/moment/min/moment.min'],
        'toastr': ['//cdn.staticfile.org/toastr.js/latest/js/toastr.min', 'components/toastr/toastr.min'],

        //text库如果使用CDN， 则无法打包
        'text': 'components/text/text',
        /* customized */
        'jquery.plot.time': 'js/misc/jquery.flot.time',
        'common': 'js/common',
        'config': 'js/config',
        app: 'js/app',
        utils: 'js/utils',
        'views/app-view': 'js/views/app-view',
        'views/map-view': 'js/views/map-view',
        'views/control-panel': 'js/views/control-panel',
        'views/timeline': 'js/views/timeline',
        'views/table-view': 'js/views/table-view',
        'views/stat-view': 'js/views/stat-view',
        'views/stat-bar-plot': 'js/views/stat-bar-plot',
        'views/avg-daily-latency': 'js/views/avg-daily-latency',
        'views/cpu-score-view': 'js/views/cpu-score-view',
        'views/hd-score-view': 'js/views/hd-score-view',
        'views/stable-view': 'js/views/stable-view',
        'views/toast-view': 'js/views/toast-view',
        'views/maskerable-view': 'js/views/maskerable-view',
        'collections/agents': 'js/collections/agents',
        'collections/reports': 'js/collections/reports',
        'collections/timespots': 'js/collections/timespots',
        'collections/daily-reports': 'js/collections/daily-reports',
        'collections/daily-net-reports': 'js/collections/daily-net-reports',
        'collections/daily-cpu-reports': 'js/collections/daily-cpu-reports',
        'collections/daily-hd-reports': 'js/collections/daily-hd-reports',
        'collections/detail-reports': 'js/collections/detail-reports',
        'models/agent': 'js/models/agent',
        'models/report': 'js/models/report',
        'models/timespot': 'js/models/timespot',
        'models/daily-report': 'js/models/daily-report',
        'models/daily-net-report': 'js/models/daily-net-report',
        'models/daily-cpu-report': 'js/models/daily-cpu-report',
        'models/daily-hd-report': 'js/models/daily-hd-report',
        'models/detail-report': 'js/models/detail-report',
        'widgets/agent-marker': 'js/widgets/agent-marker',
        'widgets/map-help-button': 'js/widgets/map-help-button',
        'widgets/mult-agent-marker': 'js/widgets/mult-agent-marker',
        'router/app-router': 'js/router/app-router'
    },
    urlArgs: "bust=" + (new Date()).getTime(),
    shim: {
        'jquery.plot': {
            deps: ['jquery'],
            exports: '$.plot'
        },
        'jquery.plot.crosshair': ['jquery.plot'],
        'jquery.plot.time': ['jquery.plot'],
        'jquery.plot.tooltip': ['jquery.plot'],
        'jquery.plot.symbol': ['jquery.plot'],
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
    },
});

requirejs(['app']);
