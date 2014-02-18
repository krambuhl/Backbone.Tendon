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