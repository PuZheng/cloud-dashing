define(function () {
    var acceptableThreshhold = 50; // 可以接受的网络延迟门槛
    var badThreshhold = 80; // 不可接受的网络延迟门槛

    AgentMarker = function (agent, point) {
        this._agent = agent;
        this._length = 32;
    }

    AgentMarker.prototype = new BMap.Overlay();

    AgentMarker.prototype.initialize = function(map){
        this._map = map;
        var div = this._tag = document.createElement("div");
        div.style.position = "absolute";  
        div.style.width = this._length + "px";
        div.style.height = this._length + "px"; 
        $(div).text(this._agent.get('id'));
        map.getPanes().labelPane.appendChild(this._tag);
        return div;
    }


    AgentMarker.prototype.getAgent = function () {
        return this._agent;
    }

    AgentMarker.prototype.draw = function(){  
         var position = this._map.pointToOverlayPixel(this._agent.get('point'));  
         this._tag.style.left = position.x - this._length / 2 + "px";  
         this._tag.style.top = position.y - this._length / 2 + "px";  
    }

    AgentMarker.prototype.update = function(data) {
        var latency = data.get("latency");
        var tag = $(this._tag);
        tag.find('i').remove();
        if (latency >= badThreshhold) {
            tag.html(tag.text() + '<i class="fa fa-warning"/>');
        } else if (latency >= acceptableThreshhold) {
            tag.html(tag.text() + '<i class="fa fa-frown-o"/>');
        } else if (latency === null) {
            tag.html(tag.text() + '<i class="fa fa-ban"/>');
        } else if (latency == -1) {
            tag.html(tag.text() + '<i class="fa fa-question"/>');
        } else {
            tag.html(tag.text() + '<i class="fa fa-smile-o"/>');
        }
    }
    return AgentMarker;
});
