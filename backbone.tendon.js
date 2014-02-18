var Tendon = (function() {
	return {};
})();
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

        // passageway function for yield
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
                for (var el in ui) {
                    elements[el] = root.$el.find(ui[el]);
                }
                return elements;
            })();

            return this;
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

            return this;
        }
    });
})();
Tendon.Yield = (function() {
    'use strict';

    var options = {
        insertMethod: "append" // or "prepend"
    };

    return Tendon.View.extend({
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
            } else if (true) {
                return this.childViews[args[0]];

            // f(func)
            } else if (_.isFunction(args[0])) {
                return args[0].call(this, options);
            }
        },

        findAll: function() {
            return _.map(this.childViews, function(view) {
                return view;
            });
        },

        _replace: function(name, view) {
            this._remove(name);
            this._insert(name, view);
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

        removeAll: function() {
            _.each(childViews, function(view) {
                if (view.close !== undefined) {
                    view.close();
                }
            });
        }
    });
}());
Tendon.Composer = (function(o) {
    'use strict';
    
    var Composer = Tendon.View.extend({ 
        initialize: function(options) {
			Tendon.View.prototype.initialize.call(this, options);
			
			this.routes = this.options.routes || [this.options.defaultRoute || "main"];
			this.defaultRoute = _.first(this.routes);

			this.vein = this.options.vein || new Tendon.Vein();
			this.yield = this.options.yield || new Tendon.Yield();

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