/**
 * 父类
 */
define(['views/maskerable-view', 'toastr', 'common', 'utils', 'collections/agents', 'jquery.plot', 'jquery.plot.time', 'jquery.plot.tooltip'],
    function (MaskerableView, toastr, common, utils, agents) {
        var StatBarPlot = MaskerableView.extend({

            initialize: function () {
                this._start = utils.getMonday(new Date()).getTime();
                this._end = this._start + common.MS_A_WEEK;
                toastr.options = {
                    "positionClass": "toast-bottom-full-width",
                    "timeOut": "1000",
                }
            },

            events: {
                'click .backward-btn': 'moveBack',
                'click .forward-btn': 'moveForward',
            },

            render: function () {
                this.$el.append(this._template());
                this.maskerView(this.container(), this.getMaskView());
                return this;
            },

            _options: function () {
                return {
                    xaxis: {
                        mode: 'time',
                        timezone: 'browser',
                        min: this._start - common.MS_A_DAY / 2,
                        max: this._end - common.MS_A_DAY / 2,
                    },
                    series: {
                        lines: { show: false },
                        points: { show: false }
                    },
                    grid: {
                        clickable: true,
                        hoverable: true,
                        borderWidth: {
                            top: 0,
                            right: 0,
                            bottom: 1,
                            left: 1
                        },
                    },
                    tooltip: true,
                    tooltipOpts: {
                        content: '%y',
                    },
                };
            },


            updateViewpoint: function (viewpoint) {
                if (!!viewpoint && (this._viewpoint != viewpoint || this._hasChanged == true)) {
                    this._viewpoint = viewpoint;
                    if (this._viewpoint && this._cloud) {
                        this.mask();
                        this._dailyReports = this.getDailyReports();
                        this._dailyReports.fetch({reset: true});
                        this._dailyReports.on('reset', this._doRender, this);
                    }
                } else {
                    this._renderPlot();
                }
            },

            _doRender: function () {
                this.unmask();
                this._renderPlot();
            },

            moveBack: function () {
                Backbone.Notifications.trigger("toastShow");
                this._end = this._start;
                this._start = this._start - common.MS_A_WEEK;
                this._hasChanged = true;
                this.updateViewpoint(this._viewpoint);
            },

            moveForward: function () {
                if (this._end >= new Date().getTime()) {
                    toastr.warning('已经是本周了!');
                    return;
                }
                Backbone.Notifications.trigger("toastShow");
                this._start = this._end;
                this._end = this._start + common.MS_A_WEEK;
                this._hasChanged = true;
                this.updateViewpoint(this._viewpoint);
            },

            updateCloud: function (cloud) {
                if (!!cloud && (this._cloud != cloud || this._hasChanged == true)) {
                    this._cloud = cloud;
                    if (this._viewpoint && this._cloud) {
                        this.mask();
                        this._dailyReports = this.getDailyReports();
                        this._dailyReports.fetch({reset: true});
                        this._dailyReports.on('reset', this._doRender, this);
                    }
                } else {
                    this._renderPlot();
                }
            }
        });
        return StatBarPlot;
    });
