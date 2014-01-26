var Tendon = Tendon || {};
Tendon.AppRouter = (function(o) {
    'use strict';

    var options = {
            app: undefined, // should be the base view definition for your application
            vent: undefined, // vent is the backbone.wreqw definition
            methods: ["main"],
            defaultRoute: "main"
            depth = 7
        };

    return Backbone.Router.extend({
        initialize: function(o) {
            _.extend(options, o);
            options.vent = options.vent || Backbone.Wreqr.EventAggregator;

            app = new options.app();
            app.router = this;
            app.vent = new options.vent();

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
        })("action"),

        action: function () {
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
            routes = (routes.length > 0) ? routes : [options.defaultRoute];

            _.defer(_.bind(function() {
                app.vent.trigger("route", routes, queries);

                // if this isnt a known method,
                // fire a unknown route event
                if (this.isMethod(routes[0])) {
                    app.vent.trigger("route:known", routes, queries);
                } else {
                    app.vent.trigger("route:unknown", routes, queries);
                }

                app.vent.trigger("route:" + routes[0], routes, queries);
            }, this))/;
        },

        nav: function(route, trigger) {
           this.navigate(route, { trigger: trigger || true });
        },
            
        isMethod: function(method) {
            if (method === undefined) return false;
            return _.contains(this.methods, method) || method == options.defaultRoute;
        }
    });
}());