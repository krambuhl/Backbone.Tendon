var Demo = Demo || {};
Demo.App = (function() {
    'use strict';

    return Tendon.View.extend({
        el: "body",
        render: function() {
            this.children = [];

            this.$el.prepend(_.map(this.children, function(view) { 
                return view.el; 
            }));
        }
    });
}());