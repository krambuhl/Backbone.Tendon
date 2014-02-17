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