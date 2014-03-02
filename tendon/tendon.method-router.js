Tendon.MethodRouter = (function(o) {
    'use strict';

    return Backbone.Router.extend({
        initialize: function(o) {
            this.options = _.extend({
                methods: ["main"],
                defaultRoute: "main",
                depth: 7
            }, o);

            this.vein = this.options.vein || new Tendon.Vein();
        },

        addMethod: function() {
            options.methods = _.union(options.methods, _.toArray(arguments)); 
        },

        removeMethod: function() {
            options.methods = _.difference(options.methods, _.toArray(arguments));
        },

        routes: function() {
            var routes = { "": "action" };

            for (var i = 0; i <= this.options.depth; i++) {
                var route = [];
                
                for (var j = 0; j <= i; j++) route.push(":" + j)
                    routes[route.join("/") + "*"] = "action"; 
            }

            return routes;
        },

        action: function () {
            var root = this,
                routes = Backbone.history.fragment.split("/"),
                queries = {};

            // crawl through the url fragment
            // and pull out query data
            _.each(routes, function(query, i) {
                var splits = query.split("?"),
                    params = (splits.length > 1) ? splits[1].split("&") : [];

                routes[i] = (splits[0] == "") ? undefined : splits[0];

                _.each(params, function(param) {
                    var splits = param.split("=");
                    queries[splits[0]] = (splits[1] !== undefined) ? splits[1] : null;
                });
            });

            routes = _.compact(routes);
            routes = (routes.length > 0) ? routes : [options.defaultRoute];

            _.defer(_.bind(function() {
                this.vein.trigger("route", routes, queries);

                // if this isnt a known method,
                // fire a unknown route event
                if (this.isMethod(routes[0])) {
                    this.vein.trigger("route:known", routes, queries);
                } else {
                    this.vein.trigger("route:unknown", routes, queries);
                }

                this.vein.trigger("route:" + routes[0], routes, queries);
            }, this));
        },

        nav: function(route, trigger) {
           this.navigate(route, { trigger: trigger || true });
        },
            
        isMethod: function(method) {
            if (method === undefined) return false;
            return _.contains(this.methods, method) || method == this.options.defaultRoute;
        }
    });
}());