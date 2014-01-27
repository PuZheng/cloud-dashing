(function () {
    var source = '<div class="btn-group">' + 
    '{{#each viewpoints}}' + 
    '<button type="button" class="btn btn-default" data-location={{ this.location }}>{{ this.name }}</button>' + 
    '{{/each}}' + 
    '</div>';
    var tmpl = Handlebars.compile(source);
    var div = null;    
    ViewpointSwitcher = function (viewpoints, map, viewpointChanged) {  
        this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
        this.defaultOffset = new BMap.Size(70, 5);  
        this._viewpoints = viewpoints;
        this._map = map;
        this._viewpointChanged = viewpointChanged;
    };
    ViewpointSwitcher.prototype = new BMap.Control();  
    ViewpointSwitcher.prototype.initialize = function (map) {  
        var viewpoints = this._viewpoints;
        div = $(tmpl({viewpoints: viewpoints}));
        $(map.getContainer()).append(div);
        var viewPointSwitcher = this;
        div.find('button').click(function () {
            var viewpoint = null;
            for (var i=0; i < viewpoints.length; ++i) {
                if (viewpoints[i].location === $(this).attr('data-location')) {
                    viewpoint = viewpoints[i];
                    break;
                }
            }
            if (viewpoint) {
                viewPointSwitcher.setViewpoint(viewpoint);
            }
        });
        return div[0];  
    };

    ViewpointSwitcher.prototype.setViewpoint = function (viewpoint) {
        var viewPointSwitcher = this;
        this._currentViewpoint = viewpoint;
        div.find('button').each(function (idx) {
            var btn = $(this);
            if (btn.attr('data-location') === viewpoint.location) {
                btn.addClass("active");
                btn.html('<i class="fa fa-eye"/>' + btn.text());
                var myGeo = new BMap.Geocoder();
                myGeo.getPoint(viewpoint.location, function(point){
                    if (point) {
                        var marker = new BMap.Marker(point);
                        viewPointSwitcher._map.addOverlay(marker);
                        marker.setAnimation(BMAP_ANIMATION_BOUNCE); 
                        window.setTimeout(function () {
                            viewPointSwitcher._map.removeOverlay(marker);
                        }, 2000);
                    }
                }, viewpoint.location);
            } else {
                btn.removeClass('active');
                btn.find('i').remove();
            }
        });
        this._viewpointChanged(this);
    }

    ViewpointSwitcher.prototype.getCurrentViewpoint = function () {
        return this._currentViewpoint;
    }
})();
