Tendon.AppRouter = (function(o) {
    'use strict';

    var options = {
            App: undefined,
            methods: ["main"],
            depth = 7
        };

    return Backbone.Router.extend({
        initialize: function(o) {
            app = new options.App();
            app.router = this;

            _.extend(options, o);
        },

        addMethod: function() {
            options.methods = _.union(options.methods, _.toArray(arguments)); 
        },

        removeMethod: function() {
            options.methods = _.difference(options.methods, _.toArray(arguments));
        },

        routes: (function(routerAction) {
            var routes = { "": routerAction };

            for (var i = 0; i <= depth; i++) {
                var route = [];
                for (var j = 0; j <= i; j++) route.push(":" + j)
                routes[route.join("/") + "*"] = routerAction;
            }

            return routes;
        })("nav"),

        nav: function () {
            var routes = Backbone.history.fragment.split("/"),
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
            routes = (routes.length > 0) ? routes : ["main"];

            _.defer(_.bind(function() {
                app.vent.trigger("route:" + routes[0], routes, queries);

                // if this isnt a known method,
                // fire a unknown route event
                if (this.isMethod(routes[0])) {
                    app.vent.trigger("route:known", routes, queries);
                } else {
                    app.vent.trigger("route:unknown", routes, queries);
                }[]
            }, this))/;
        },
            
        isMethod: function(method) {
            return _.contains(methods, method || "");
        }
    });
}());