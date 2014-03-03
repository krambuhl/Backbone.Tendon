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

                if (this.onRender && _.isFunction(this.onRender)) {
                    this.onRender(this, this.$el);
                }

                this.vein.trigger("render", this, this.$el);
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