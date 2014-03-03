Tendon.Composer = (function(o) {
    'use strict';
    
    var Composer = Tendon.Layout.extend({ 
        initialize: function(options) {
            Tendon.Layout.prototype.initialize.call(this, options);

			this.routes = options.routes || this.routes || ["main"];
            this.router = new Tendon.MethodRouter({
                methods: this.routes,
                vein: this.vein,
                defaultRoute: options.defaultRoute || this.routes[0]
            });

			this._initListeners();
            
            this.vein.on("render", _.bind(function() {
                this.children = options.children || this.children;
                this.addChildren();
            }, this));
        },

        _initListeners: function() {
        	var root = this;
        	_.each(this.routes, function(route) { 
        		root.vein.on("route:" + route, function(routes, queries) {
                    var cbName = "on" + Tendon.utl.strCapitalize(route),
                        func = root.options[cbName] || root[cbName];

                    if (_.isFunction(func)) {
                        func.call(root, routes, queries);
                    }
                });
        	});

            this.vein.on("route:unknown", function(routes, queries) {
                var func = root.options.onUnknownRoute || root.onUnknownRoute;

                if (_.isFunction(func)) {
                    func.call(root, routes, queries);
                }
            });

        },

        addChildren: function() {
            var root = this;
            _.each(this.children, function(child, name) {
                if (root.layout[name]) {
                    root.layout[name].insert(child);
                } else { }
            });
        }
    });

    return Composer;
})();