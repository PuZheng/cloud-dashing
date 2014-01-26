function getViewpoints(handler) {
    // TODO not implemented
    handler([
                {name: "北京", cannonical_name: "北京市"},
                {name: "上海", cannonical_name: "上海市"}
            ]); 
}

function getClouds(handler) {
    var clouds = [
            {id: 1, name: "百度云", location: "北京市"},
            {id: 2, name: "阿里云", location: "杭州市"},
        ];
    handler(clouds);
}

function getUserLocation(handler) {
    // TODO not implemented
    var viewpoint = {name: "北京", cannonical_name: "北京市"};
    handler(viewpoint);
}

function getStatusList(viewpoint, start, end, callback) {
    // TODO not implemented
    var startTime = start.getTime();
    var reports = [];
    for (var i=0; i < 24 * 60 / 5; ++i) {
        var statusList = [
        {
            id: 1, 
            latency: 20 + Math.abs(Math.floor(Math.random()*30+Math.sin(i/20+Math.random()*2)*20+Math.sin(i/10+Math.random())*10))
        }, 
        {
            id: 2,
            latency: 40 + Math.abs(Math.floor(Math.random()*30+Math.sin(i/20+Math.random()*2)*20+Math.sin(i/10+Math.random())*10))
        }
        ];
        reports.push({at: startTime + i * 5 * 60 * 1000, statusList: statusList});
    }

    callback(reports, start);
}
