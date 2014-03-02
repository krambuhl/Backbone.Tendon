Tendon.Composer = (function(o) {
    'use strict';
    
    var Composer = Tendon.View.extend({ 
        initialize: function(options) {
			Tendon.View.prototype.initialize.call(this, options);
			
			this.routes = this.options.routes || [this.options.defaultRoute || "main"];
			this.defaultRoute = this.routes[0];

			this.initContainers();
			this.initListeners();
        },

        initContainers: function() {
        	
        },

        initListeners: function() {
        	var root = this;
        	_.each(this.routes, function() { 
        		root.vein.on("route:")
        	});
        }
    });

    return Composer;
})();