require.config({
    baseUrl: 'static',
    paths: {
        /* 3rd party */
        jquery: 'components/jquery/dist/jquery.min',
        'jquery-map': 'components/jquery/jquery.min.map',
        underscore: 'components/underscore/underscore',
        'underscore.string': 'components/underscore.string/dist/underscore.string.min',
        kineticjs: 'components/kineticjs/kinetic.min',
        backbone: 'components/backbone/backbone',
        handlebars: 'components/handlebars/handlebars.amd.min',
        select2: 'components/select2/select2.min',
        bootstrap: 'components/bootstrap/dist/js/bootstrap.min',
        'jquery.plot': 'components/flot/jquery.flot',
        'jquery.plot.crosshair': 'components/flot/jquery.flot.crosshair',
        'jquery.plot.symbol': 'components/flot/jquery.flot.symbol',
        'moment': 'components/moment/min/moment.min',
        'toastr': 'components/toastr/toastr.min',
        //text库如果使用CDN， 则无法打包
        'text': 'components/text/text',

        /* customized */
        'jquery-plugins': 'js/jquery-plugins',
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
        'views/matrix-view': 'js/views/matrix-view',
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
    //urlArgs: "bust=" + (new Date()).getTime(),
    urlArgs: "bust=>de78fb6d08eadd3488e7bc8cadab93bb57ab20d8",
    shim: {
        'underscore.string': {
            deps: ['underscore'],
        },
        'jquery.plot': {
            deps: ['jquery'],
            exports: '$.plot'
        },
        'jquery.plot.crosshair': ['jquery.plot'],
        'jquery.plot.time': ['jquery.plot'],
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
