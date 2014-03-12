var Tendon = (function() {
	return {};
})();
Tendon.utl = (function() {
	return {
		strCapitalize: function(str) {
			return str.replace(/^./, function (char) {
        		return char.toUpperCase();
		    });
		}
	}
})();
Tendon.MethodRouter = (function(o) {
    'use strict';

    return Backbone.Router.extend({
        initialize: function(o) {
            this.options = _.extend({
                defaultRoute: "main"
            }, o);

            this.methods = this.options.methods || [this.options.defaultRoute];
            this.vein = this.options.vein || new Tendon.Vein();
        },

        addMethod: function() {
            this.methods = _.union(this.methods, _.toArray(arguments)); 
        },

        removeMethod: function() {
            this.methods = _.difference(this.methods, _.toArray(arguments));
        },

        routes: (function() {
            var routes = { "": "action" };

            for (var i = 0; i <= 10; i++) {
                var route = [];
                
                for (var j = 0; j <= i; j++) route.push(":" + j)
                    routes[route.join("/") + "*"] = "action"; 
            }

            return routes;
        })(),

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
            routes = (routes.length > 0) ? routes : [this.options.defaultRoute];

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
            return _.contains(this.options.methods, method) || method == this.options.defaultRoute;
        }
    });
}());
// Via: https://github.com/marionettejs/backbone.wreqr/blob/master/lib/backbone.wreqr.js
// The spirit of Tendon is a no fils setup, wreqr does too much, but the EventAggregator is perfectly utilitarian

Tendon.Vein = (function(o) {
    'use strict';

    var Vein = function() { };

    // Copy the `extend` function used by Backbone's classes
    Vein.extend = Backbone.View.extend;

    // Copy the basic Backbone.Events on to the event aggregator
    _.extend(Vein.prototype, Backbone.Events);

    return Vein;
}());
Tendon.View = (function() {
    return Backbone.View.extend({
        initialize: function(options) {
            Backbone.View.prototype.initialize.apply(this, arguments);

            // options overright extended behavior
            _.extend(this, {
                vein: _.result(this, 'vein') || new Tendon.Vein(),
                model: _.result(this, 'model') || new Backbone.Model()
            }, options);

            this.options = options;

            this.events = this.setupUIEvents(_.result(this, 'events'));

            this.vein.trigger("render:before", this, this.$el);
            
            if (this.onBeforeRender && _.isFunction(this.onBeforeRender)) {
                this.onBeforeRender(this, this.$el);
            }

            this.render(this.model);

            _.defer(_.bind(function() {
                if (this.ui) {
                    this.initUI(this.ui);
                }

                this.vein.trigger("render", this, this.$el);

                if (this.onRender && _.isFunction(this.onRender)) {
                    this.onRender(this, this.$el);
                }
            }, this));
        },

        render: function(model) {
            if (_.isFunction(this.template)) {
                this.setElement(this.template(model.attributes));
            } else if (_.isString(this.template)) {
                this.setElement(_.template(this.template, model.attributes));
            }
        },

        close: function() {
            this.remove();
            this.unbind();

            if (this.onClose && _.isFunction(this.onClose)) {
                _.defer(_.bind(function() {
                    this.onClose(this);
                }, this));
            }

            this.vein.trigger("close", this);
        },

        initUI: function(ui) {
            var root = this;
            this.ui = (function() {
                var elements = {};
                for (var el in ui) {
                    elements[el] = root.$el.find(ui[el]);
                }
                return elements;
            })();
        },


        // via. marionette.view
        // allows for the use of the @ui. syntax within
        // a given key for triggers and events
        // swaps the @ui with the associated selector
        setupUIEvents: function(hash) {
            if (typeof(hash) === "undefined") {
                return;
            }

            _.each(_.keys(hash), function(v) {
                var split = v.split("@ui.");

                if (split.length === 2) {
                    hash[split[0] + this.ui[split[1]]] = hash[v];
                    delete hash[v];
                }
            }, this);

            return hash;
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
        }
    });
})();
Tendon.Yield = (function() {
    'use strict';

    var options = {
        insertMethod: "append" // or "prepend"
    };

    var yieldView = Tendon.View.extend({
        initialize: function(options) {
            Tendon.View.prototype.initialize.call(this, options);

            this.childViews = {};
        },

        _insert: function(name, view) {
            if (this.childViews[name] === undefined) {
                this.childViews[name] = view;
                this.$el[options.insertMethod](view.el);      
            } else {
                this.replace(name, view);
            }
        },

        insert: function() {
            var args = _.toArray(arguments);
            // Function Overload

            // f(name, view)
            if (_.isString(args[0]) && args[1] instanceof Backbone.View) {
                this._insert(args[0], args[1]);

            // f(view)
            } else if (args[0] instanceof Backbone.View) {
                this._insert(args[0].cid, args[0]);

            // f(func) 
            // func is called with yield instance as context
            } else if (_.isFunction(args[0])) {
                args[0].call(this, options);
            }
        },

        find: function() {
            var args = _.toArray(arguments);

            // Function Overload

            // f(view)
            if (args[0] instanceof Backbone.View) {
                return this.childViews[args[0].cid];

            // f(name)
            } else if (_.isString(args[0])) {
                return this.childViews[args[0]];

            // f(func)
            } else if (_.isFunction(args[0])) {
                return args[0].call(this, options);
            } else {
                return _.map(this.childViews, function(view) {
                    return view;
                });
            }
        },

        // current setup will not maintain order
        _replace: function(name, view) {
            if (this.childViews[name] === undefined) {
                this._insert(name, view);
                return;
            }

            // replace dom element in place
            this.childViews[name].$el.replaceWith(view.el);
            
            // close old view
            this.childViews[name].close()
            
            // update references
            this.childViews[name] = view;
        },

        replace: function() {
            var args = _.toArray(arguments);

            // Fucntion Overload

            // f(view, view)
            if (args[0] instanceof Backbone.View && args[1] instanceof Backbone.View) {
                this._replace(args[0].cid, args[0]);

            // f(name, view)
            } else if (_.isString(args[0]) && args[1] instanceof Backbone.View) {
                this._replace(args[0], args[0]);

            // f(func)
            } else if (_.isFunction(args[0])) {
                args[0].call(this, options);
            }
        },

        _remove: function(name, view) {
            if (!_.isUndefined(this.childViews[name])) {
                this.childViews[name].close();
                delete this.childViews[name];
            }
        },

        // wont work if removing via a view reference
        // after adding with a user spec. name
        // should review childViews by view equallity
        remove: function() {
            var args = _.toArray(arguments);

            // Fucntion Overload

            // f(view)
            if (args[0] instanceof Backbone.View) {
                this._remove(args[0].cid);

            // f(name)
            } else if (_.isString(args[0])) {
                this._remove(args[0]);

            // f(func)
            } else if (_.isFunction(args[0])) {
                args[0].call(this, options);
            }
        },

        empty: function() {
            _.each(this.childViews, function(view) {
                if (view.close !== undefined) {
                    view.close();
                }
            });
        },

    });

    // Borrowing this code from Backbone.Collection:
    // http://backbonejs.org/docs/backbone.html#section-106
    //
    // Mix in methods from Underscore, for iteration, and other
    // collection related features.
    var methods = ['forEach', 'each', 'map', 'detect', 'filter', 
        'select', 'reject', 'every', 'all', 'some', 'any', 'include', 
        'contains', 'invoke', 'toArray', 'first', 'initial', 'rest', 
        'last', 'without', 'isEmpty', 'pluck'];

    _.each(methods, function(method) {
        yieldView.prototype[method] = function() {
            var views = _.values(this.childViews);
            var args = [views].concat(_.toArray(arguments));
            return _[method].apply(_, args);
        };
    });

    return yieldView;
}());
Tendon.Layout = (function() {
    'use strict';

    return Tendon.View.extend({
        initialize: function(options) {
            Tendon.View.prototype.initialize.call(this, options);

            this.vein.on("render", _.bind(function() {
                this.initLayout(this.layout || this.options.layout)
            }, this));
        },

        initLayout: function(layout) {
            var root = this;
            this.layout = (function() {
                var elements = {};
                for (var el in layout) {
                    elements[el] = new (Tendon.Yield.extend())({
                        el: root.$el.find(layout[el])
                    });
                }
                return elements;
            })();
        }
    });
}());
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

            this.vein.on("route:known", function(routes, queries) {
                var func = root.options.onKnownRoute || root.onKnownRoute;

                if (_.isFunction(func)) {
                    func.call(root, routes, queries);
                }
            });

        },

        addChildren: function() {
            var root = this;
            _.each(this.children, function(child, name) {
                var newLayout = _.result(root.children, name);
                if (root.layout[name]) {
                    root.layout[name].insert(newLayout);
                }
            });
        }
    });

    return Composer;
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