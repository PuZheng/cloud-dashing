function getUserLocation(handler) {
    // TODO not implemented
    var viewpoint = {name: "北京", cannonical_name: "北京市"};
    handler(viewpoint);
}

function getStatusList(viewpoint, start, end, callback) {
    // TODO lnot implemented
    var clouds = [
    {name: "百度云", address: "北京市", color: "#ff0000"},
    {name: "阿里云", address: "杭州市", color: "#0000ff"}];

    for (var i=0; i < clouds.length; ++i) {
        var cloud = clouds[i];
        var cloudStatusList = [];
        var startTime = start.getTime();
        for (var j=0; j < 24 * 60 / 5; ++j) {
            cloudStatusList.push({at:startTime + j * 5 * 60 * 1000, 
                latency: i*20 + Math.abs(Math.random()*30+Math.sin(j/20+Math.random()*2)*20+Math.sin(j/10+Math.random())*10)});
        }
        cloud.cloudStatusList = cloudStatusList;
    }
    callback(clouds, start);
}
