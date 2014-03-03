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