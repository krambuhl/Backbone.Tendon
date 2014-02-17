Tendon.AppRouter = (function(o) {
    'use strict';

    var options = {
        app: undefined, // should be the base view definition for your application
        vent: undefined, // vent is the backbone.wreqw definition
        methods: ["main"],
        defaultRoute: "main",
        depth: 7
    };

    return Backbone.Router.extend({
        initialize: function(o) {
            _.extend(options, o);
            options.vent = options.vent || Backbone.Wreqr.EventAggregator;

            app = this.app = new options.app();
            app.vent = this.vent = new options.vent();
            app.router = this;
        },

        addMethod: function() {
            options.methods = _.union(options.methods, _.toArray(arguments)); 
        },

        removeMethod: function() {
            options.methods = _.difference(options.methods, _.toArray(arguments));
        },

        routes: (function(routerAction) {
            var routes = { "": routerAction };

            for (var i = 0; i <= options.depth; i++) {
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
            }, this));
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
var Tendon = (function() {
	return {};
})();
Tendon.JsonpCollection = (function(o) {
    'use strict';
    
    return Backbone.Collection.extend({
        sync: function(method, model, options) {
            var params = _.extend({
                type: 'GET',
                url: this.url(),
                dataType: "jsonp",
                processData: false
            }, options);

            return $.ajax(params);
        },

        parse: function(response) {
            if (this.type && response[this.type]) {
                return response[this.type];
            } else {
                return response;
            }
        }
    });
}());
var Tendon = Tendon || {};
Tendon.View = (function() {
	return Backbone.View.extend({
		initialize: function(options) {
			this.options = options || {};
			this.render(this.model && this.model.attributes ? this.model.attributes : {});

			_.defer(_.bind(function() {
				if (this.ui || this.options.ui) {
					this.setUI(this.ui || this.options.ui);
				}

				if (this.onRender && _.isFunction(this.onRender)) {
					this.onRender(this.$el);
				}
			}, this));

			return this;
		},

		render: function(model) {
			if (this.template !== undefined) {
				var templateData = _.extend(this.options && this.options.globals ? this.options : {}, model);

				if (_.isFunction(Template.find(this.template))) {
					this.setElement(Template.render(this.template, templateData));
				} else if (_.isFunction(this.template)) {
					this.setElement(this.template(templateData));
				}
			}

			return this;
		},

		// passageway function for layout
		show: function() {
			if (this.onShow && _.isFunction(this.onShow)) {
				_.defer(_.bind(function() {
					this.onShow(this.$el);
				}, this));
			}

			return this;
		},

		close: function() {
			this.remove();
			this.unbind();

			if (this.onClose && _.isFunction(this.onClose)) {		
				_.defer(_.bind(function() {
					this.onClose(this);
				}, this));
			}

			return this;
		},

		setUI: function(ui) {
			var root = this;
			this.ui = (function() {
				var elements = {};
				for(var el in ui) {
					elements[el] = root.$el.find(ui[el]);
				}
				return elements;
			})();

			return this;
		},

		state: function(prop, val) {
    		if (!_.isUndefined(val) && _.isBoolean(val)) {
	    		if (val) {
	    			this.$el.addClass("is-" + prop);
	    		} else {
	    			this.$el.removeClass("is-" + prop);
	    		}
    		} else {
    			return this.$el.hasClass("is-" + prop);
    		}

    		return this;
    	}
	});
})();
Tendon.Yield = (function() {
    'use strict';

    var childViews = {};
    var options = {
        insertMethod: "append" // or "prepend"
    };

    return Tendon.View.extend({
        tagName: "section",
        className: "yield",

        insert: function() {
            var args = _.toArray(arguments),
                options = _.last(args);

            // Function Overload

            // f(name, view)
            if (_.isString(args[0]) && args[1] instanceof Backbone.View) {
                childViews[args[0]] = args[1];
                this.$el[options.insertMethod](args[1].el);

            // f(view)
            } else if (args[0] instanceof Backbone.View) {
                childViews[args[0].cid] = args[0];
                this.$el[options.insertMethod](args[0].el);

            // f(func) 
            // func is called with yield instance as context
            } else if (_.isFunction(args[0])) {
                args[0].call(this, options);
            }
        },

        find: function() {
            var args = _.toArray(arguments),
                options = _.last(args);

            // Function Overload

            // f(view)
            if (args[0] instanceof Backbone.View) {
                return childViews[args[0].cid] || false;

            // f(name)
            } else if (true) {
                return childViews[args[0]];

            // f(func)
            } else if (_.isFunction(args[0])) {
                args[0].call(this, options);
            }
        },

        findAll: function() {
            return _.map(childViews, function(view) {
                return view;
            });
        },

        replace: function() {
            var args = _.toArray(arguments),
                options = _.last(args);

        },

        remove: function() {
            var args = _.toArray(arguments),
                options = _.last(args);
        },

        removeAll: function() {
            _.each(childViews, function(view) {
                if (view.close !== undefined) {
                    view.close();
                }
            });
        },

        yield: function(route, view) {
            this.closeCurrent();

            this.currentView = this[route + "View"] = this[route + "View"] || new view();
            this.$el.html(this.currentView.el);
        }
    });
}());