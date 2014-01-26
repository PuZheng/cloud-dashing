(function () {
    var source = '<div class="btn-group">' + 
    '{{#each viewpoints}}' + 
    '<button type="button" class="btn btn-default" data-cannonical-name={{ this.cannonical_name }}>{{ this.name }}</button>' + 
    '{{/each}}' + 
    '</div>';
    var tmpl = Handlebars.compile(source);
    var div = null;    
    ViewPointSwitcher = function (viewpoints, map, viewpointChanged) {  
        this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
        this.defaultOffset = new BMap.Size(70, 5);  
        this._viewpoints = viewpoints;
        this._map = map;
        this._viewpointChanged = viewpointChanged;
    };
    ViewPointSwitcher.prototype = new BMap.Control();  
    ViewPointSwitcher.prototype.initialize = function (map) {  
        var viewpoints = this._viewpoints;
        div = $(tmpl({viewpoints: viewpoints}));
        $(map.getContainer()).append(div);
        var viewPointSwitcher = this;
        div.find('button').click(function () {
            var viewpoint = null;
            for (var i=0; i < viewpoints.length; ++i) {
                if (viewpoints[i].cannonical_name === $(this).attr('data-cannonical-name')) {
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

    ViewPointSwitcher.prototype.setViewpoint = function (viewpoint) {
        var viewPointSwitcher = this;
        this._currentViewPoint = viewpoint;
        div.find('button').each(function (idx) {
            var btn = $(this);
            if (btn.attr('data-cannonical-name') === viewpoint.cannonical_name) {
                btn.addClass("active");
                btn.html('<i class="fa fa-eye"/>' + btn.text());
                var myGeo = new BMap.Geocoder();
                myGeo.getPoint(viewpoint.cannonical_name, function(point){
                    if (point) {
                        var marker = new BMap.Marker(point);
                        viewPointSwitcher._map.addOverlay(marker);
                        marker.setAnimation(BMAP_ANIMATION_BOUNCE); 
                        window.setTimeout(function () {
                            viewPointSwitcher._map.removeOverlay(marker);
                        }, 2000);
                    }
                }, viewpoint.cannonical_name);
            } else {
                btn.removeClass('active');
                btn.find('i').remove();
            }
        });
        this._viewpointChanged(this);
    }

    ViewPointSwitcher.prototype.getCurrentViewPoint = function () {
        return this._currentViewPoint;
    }
})();
