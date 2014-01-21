Tendon.Yield = (function() {
    'use strict';

    return Backbone.View.extend({
        tagName: "section",
        className: "layout-section layout",

        initialize: function() {
            _.bindDefer(function() {                
                this.setupListeners();
            }, this);
        },

        closeCurrent: function() {
            if (this.currentView !== undefined) 
                this.currentView.close();
        },

        yield: function(route, view) {
            this.closeCurrent();

            this.currentView = this[route + "View"] = this[route + "View"] || new view();
            this.$el.html(this.currentView.el);
        },

        setupListeners: function() {
            app.vent.on("route:main", _.bind(function() {
                this.closeCurrent();

                // find out if this use has signup before
                if (Cookie.find("deception-recruit") === null) {
                    this.yield("signup", Deception.SignupView);
                } else {
                    this.yield("returning", Deception.ReturningView);
                }
            }, this));

            app.vent.on("route:unknown", _.bind(function() {
                console.log("unknown");
            }, this));
        }
    });
}());