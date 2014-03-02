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