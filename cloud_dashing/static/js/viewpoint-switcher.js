(function () {
    var source = '<div class="btn-group">' + 
    '{{#each viewpoints}}' + 
    '<button type="button" class="btn btn-default">{{ this.name }}<i class="fa fa-eye" /></button>' + 
    '{{/each}}' + 
    '</div>';
    var tmpl = Handlebars.compile(source);
    ViewPointSwitcher = function (viewpoints) {  
        this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
        this.defaultOffset = new BMap.Size(70, 5);  
        this._viewpoints = viewpoints;
    };
    ViewPointSwitcher.prototype = new BMap.Control();  
    ViewPointSwitcher.prototype.initialize = function (map) {  
        var div = $(tmpl({
            viewpoints: this._viewpoints
        }));
        $(map.getContainer()).append(div);
        return div[0];  
    };
})();
