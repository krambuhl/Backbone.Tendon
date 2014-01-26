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
            } else if () {
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