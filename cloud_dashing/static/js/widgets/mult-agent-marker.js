/**
 * Created by Young on 14-2-27.
 */
define(['jquery', 'underscore', 'handlebars', 'kineticjs', 'text!templates/agent-brief.hbs', 'common', 'bootstrap'], function ($, _, Handlebars, Kinetic, agentBriefTemplate, common) {
    var location2agents = {};
    var _template = Handlebars.default.compile(agentBriefTemplate);
    var layer = null;
    var agent2markerTag = {};
    var agent2line = {};

    var MultAgentMarker = function (agents) {
        this._agents = agents;
        this._length = 50;
    };

    MultAgentMarker.initMarkers = function (agents, layer_) {
        layer = layer_;
        var location2agents = _.groupBy(agents, function (agent) {
            return agent.get('location');
        });
        return _.values(location2agents).map(function (agents) {
            return new MultAgentMarker(agents);
        });
    };

    MultAgentMarker.prototype = new BMap.Overlay();

    MultAgentMarker.prototype.initialize = function (map) {
        this._map = map;
        this._lines = [];
        this._tag = $("<div class='agent-marker'></div>").css({
            position: 'absolute',
            width: this._length + 'px',
            height: this._length + 'px',
        });
        map.getPanes().labelPane.appendChild(this._tag[0]);
        if (this._agents.length === 1) {
            var agent = this._agents[0];
            var tag = $('<span class="fa-stack" data-marker="' + agent.id + '"><i class="fa fa-cloud fa-stack-1x" style="color:' + agent.get('color') + '"></i><small class="fa-stack-1x">' + agent.id + '</small></span>');
            this._tag.append(tag);
            tag.css({
                position: 'absolute',
                left:  (this._length - tag.width()) / 2 + 'px',
                top: (this._length - tag.height()) / 2 + 'px'
            });
            tag.tooltip('destroy').tooltip({
                title: function () {
                    return _template({
                        agent: agent.toJSON(),
                    });
                },
                html: true,
                placement: 'right',
                container: 'body',
            });
            agent2markerTag[agent.id] = tag;
        } else {
            this._agents.forEach((function (agent, idx) {
                var tag = $('<span class="fa-stack"><i class="fa fa-cloud fa-stack-1x" style="color:' + agent.get('color') + '"></i><small class="fa-stack-1x">' + agent.id + '</small></span>');
                this._tag.append(tag);
                tag.css({
                    position: 'absolute',
                    left: Math.round(Math.cos(2 * Math.PI * idx / this._agents.length) * 15) + (this._length - tag.width()) / 2 + 'px',
                    top: Math.round(Math.sin(2 * Math.PI * idx / this._agents.length) * 15) + (this._length - tag.height()) / 2 + 'px',
                });
                tag.tooltip('destroy').tooltip({
                    title: function () {
                        return _template({
                            agent: agent.toJSON(),
                        });
                    },
                    html: true,
                    placement: 'right',
                    container: 'body',
                });
                agent2markerTag[agent.id] = tag;
            }).bind(this));
        }
        this._tag.css('border-color', this._agents[0].get('color'));
        $.each(this._agents, function (idx, agent) {
            var markerTag = agent2markerTag[agent.id];
            var line = new Kinetic.Line({
                stroke: agent.get('color'),
                strokeWidth: 0,
                lineCap: 'round',
                lineJoin: 'round',
            });                                
            line.hide();
            layer.add(line);
            agent2line[agent.id] = line;
            this._lines.push(line);

        }.bind(this));
        return this._tag[0];
    };

    MultAgentMarker.prototype.getLines = function () {
        return this._lines;
    }

    MultAgentMarker.prototype.updateViewpoint = function (viewpoint) {
        this._viewpoint = viewpoint;
        var agents = _.map(this._agents, function (agent) {
            return agent.toJSON();
        });
        var endPos = this._map.pointToOverlayPixel(this._viewpoint.point);
        $.each(this._agents, function (idx, agent) {
            var markerTag = agent2markerTag[agent.id];
            if (!markerTag.is(':visible')) {
                markerTag.show();
            }
            var startX = markerTag.parent().position().left + markerTag.position().left + markerTag.width() / 2;
            var startY = markerTag.parent().position().top + markerTag.position().top + markerTag.height() / 2;
            var line = agent2line[agent.id];
            line.points([startX + this._map.offsetX, startY + this._map.offsetY, endPos.x + this._map.offsetX, endPos.y + this._map.offsetY]);
            if (!agent.get('selected')) {
                line.hide();
                markerTag.hide();
            }
        }.bind(this));
    };

    MultAgentMarker.prototype.toggleAgent = function () {
        if (!!this._data) {
            this.update(this._data);
        }
    };

    MultAgentMarker.prototype.draw = function () {
        var position = this._map.pointToOverlayPixel(this._agents[0].get('point'));
        
        this._center = position;
        this._tag.css({
            left: position.x - this._length / 2 + "px",
            top: position.y - this._length / 2 + "px"
        });
    };

    MultAgentMarker.prototype._getStrokeWidth = function (latency) {
        if (!latency) {
            return 0;
        } else if (latency >= common.BAD_LATENCY_THRESHHOLD) {
            return 1;
        } else if (latency >= common.ACCEPTABLE_LATENCY_THRESHHOLD) {
            return 2;
        } else if (latency == -1) {
            return -1
        } else {
            return 3;
        }
    }

    MultAgentMarker.prototype.update = function (data) {
        this._data = data;
        var endPos = this._map.pointToOverlayPixel(this._viewpoint.point);
        $.each(this._agents, function (idx, agent) {
            var markerTag = agent2markerTag[agent.id];
            var line = agent2line[agent.id];
            if (agent.get("selected") === true && agent.id != this._viewpoint.id) {
                markerTag.show();
                markerTag.parent().css({
                    'pointer-events': 'auto',
                });
                var strokeWidth = this._getStrokeWidth(data[agent.id]);
                if (strokeWidth > 0) {
                    var line = agent2line[agent.id];
                    line.show();
                    line.strokeWidth(strokeWidth);
                    line.dash([(5 - strokeWidth) * 2, (5 - strokeWidth) * 2]);
                }
            } else {
                markerTag.hide();
                markerTag.parent().css({
                    'pointer-events': 'none',
                });
                line.hide();
            }
        }.bind(this));
    };
    return MultAgentMarker;
});
