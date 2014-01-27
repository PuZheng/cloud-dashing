function getViewpoints(handler) {
    // TODO not implemented
    setTimeout(function () {
        handler([
                    {id: 1, name: "北京", location: "北京市"},
                    {id: 2, name: "上海", location: "上海市"}
                ]); 
    }, 100);
}

function getClouds(handler) {
    var clouds = [
            {id: 1, name: "百度云", location: "北京市"},
            {id: 2, name: "阿里云", location: "杭州市"},
        ];
    setTimeout(function () {handler(clouds);}, 100);
}

function getUserLocation(viewpoints, handler) {
    // TODO not implemented
    var viewpoint = {id: 1, name: "北京", location: "北京市"};
    setTimeout(function () {handler(viewpoint);}, 100);
}

function getStatusList(viewpoint, start, end, callback) {
    // TODO not implemented
    var startTime = start.getTime();
    var reports = [];
    for (var i=0; i < 24 * 60 / 5; ++i) {
        var statusList = [
        {
            id: 1, 
            latency: viewpoint.id * 20 + Math.abs(Math.floor(Math.random()*30+Math.sin(i/20+Math.random()*2)*20+Math.sin(i/10+Math.random())*10))
        }, 
        {
            id: 2,
            latency: viewpoint.id * 40 + Math.abs(Math.floor(Math.random()*30+Math.sin(i/20+Math.random()*2)*20+Math.sin(i/10+Math.random())*10))
        }
        ];
        reports.push({at: startTime + i * 5 * 60 * 1000, statusList: statusList});
    }

    setTimeout(function () {callback(reports, start);}, 100);
}
