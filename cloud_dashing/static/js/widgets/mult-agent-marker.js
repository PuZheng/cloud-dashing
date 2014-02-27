/**
 * Created by Young on 14-2-27.
 */
define(['jquery', 'underscore', 'handlebars', 'text!/static/templates/mult-agent-brief.hbs', 'bootstrap'], function ($, _, Handlebars, agentBriefTemplate) {
    var location2agents = {};
    var acceptableThreshhold = 50; // 可以接受的网络延迟门槛
    var badThreshhold = 80; // 不可接受的网络延迟门槛
    var _template = Handlebars.default.compile(agentBriefTemplate);

    var MultAgentMarker = function () {
        this._agents = [];
        this._length = 32;
    };
    MultAgentMarker.initMarkers = function (agents) {
        agents.each(function (agent) {
            var location = agent.get("location");
            var marker;
            if (location in location2agents) {
                marker = location2agents[location];
            } else {
                marker = new MultAgentMarker();
                location2agents[location] = marker;
            }
            marker.addAgent(agent);
        });
        return _.values(location2agents);
    };

    MultAgentMarker.prototype = new BMap.Overlay();

    MultAgentMarker.prototype.addAgent = function (agent) {
        this._agents.push(agent);
    };


    MultAgentMarker.prototype.initialize = function (map) {
        this._map = map;
        this._tag = $("<div class='agent-marker'></div>").css({
            position: 'absolute',
            width: this._length + 'px',
            height: this._length + 'px',
        });
        map.getPanes().labelPane.appendChild(this._tag[0]);
        return this._tag[0];
    };


    MultAgentMarker.prototype.updateTooltip = function (viewpoint) {
        this._viewpoint = viewpoint;
        var agents = _.map(this._agents, function (agent) {
            return agent.toJSON();
        });
        this._tag.tooltip('destroy').tooltip({
            title: function () {
                return _template({
                    agents: agents,
                });
            },
            html: true,
            placement: 'right',
            container: 'body',
        });
    };

    MultAgentMarker.prototype.toggleAgent = function () {
        if (!!this._data) {
            this.update(this._data);
        }
    };

    MultAgentMarker.prototype.draw = function () {
        var position = this._map.pointToOverlayPixel(this._agents[0].get('point'));
        this._tag.css({
            left: position.x - this._length / 2 + "px",
            top: position.y - this._length / 2 + "px"
        });
    };

    MultAgentMarker.prototype.update = function (data) {
        this._data = data;
        this._tag.find('i').remove();
        var warningICON = '<i class="fa fa-warning"/>';
        var frownICON = '<i class="fa fa-frown-o"/>';
        var questionICON = '<i class="fa fa-question"/>';
        var banICON = '<i class="fa fa-ban"/>';
        var simleICON = '<i class="fa fa-smile-o"/>';
        var html = "";
        var _agents = this._agents;
        var _viewpoint_id = this._viewpoint.id;
        $.each(_agents, function (idx, agent) {
            if (agent.get("selected") === true && agent.id != _viewpoint_id) {
                var latency = data[agent.id];
                var icon;
                if (!latency) {
                    icon = questionICON;
                } else if (latency >= badThreshhold) {
                    icon = warningICON;
                } else if (latency >= acceptableThreshhold) {
                    icon = frownICON;
                } else if (latency == -1) {
                    icon = banICON;
                } else {
                    icon = simleICON;
                }
                html += (agent.id + icon + "<br>");
            }
        });
        this._tag.html($("<div></div>").addClass("panel panel-default").html(html));
    };
    return MultAgentMarker;
});
