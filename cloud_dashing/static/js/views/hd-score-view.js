define(['handlebars', 'views/stat-bar-plot', 'text!/static/templates/hd-score-view.hbs', 'collections/daily-hd-reports', 'collections/agents'], function (Handlebars, StatBarPlot, hdScoreViewTemplate, DailyHdReports, agents) {

    var HdScoreView = StatBarPlot.extend({
        _template: Handlebars.default.compile(hdScoreViewTemplate),

        getDailyReports: function () {
            return new DailyHdReports(this._viewpoint, this._cloud, this._start, this._end);
        },

        container: function () {
            return this.$('.hd-score');
        },

        _renderPlot: function () {
            if (!this._dailyReports) {
                return;
            }
            var data = [];
            var series = [];
            this._dailyReports.each(function (dailyReport) {
                var time = new Date(dailyReport.get('time') * 1000);
                var date = new Date(time.getFullYear(), time.getMonth(), time.getDate());
                series.push([date.getTime(), parseInt(dailyReport.get('data')['磁盘性能']['分数'])]);
            });
            data.push({
                data: series,
                bars: {
                    show: true,
                    lineWidth: 0,
                    fill: true,
                    fillColor: agents.get(this._cloud.id).get('color'),
                    align: 'center',
                    barWidth: (4 * 60 * 60 * 1000),
                },
            });
            this._plot = $.plot(this.container(), data, this._options());
            this._hasChanged = false;
        },
        getMaskView: function () {
            return this.$('.mask');
        },

    });

    return HdScoreView;
});
