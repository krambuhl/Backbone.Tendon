var Tendon = Tendon || {};
Tendon.View = (function() {
	
	return Backbone.View.extend({
        constructor: function(options) {
            this.options = options;
            this.apply(this, arguments);
		},

		initialize: function(options) {
			this.render(this.model && this.model.attributes ? this.model.attributes : {});

			if (this.options.ui) {
				this.setUI(this.options.ui);
			}

			return this;
		},

		render: function(model) {
			if (this.template !== undefined) {
				var templateData = _.extend(this.options && this.options.globals ? this.options : {}, model);

				if (_.isFunction(Template.find(this.template))) {
					this.$el.html(Template.render(this.template, templateData));
				} else if (_.isFunction(this.template)) {
					this.$el.html(this.template(templateData));
				}
			}

			if (this.onRender && _.isFunction(this.onRender)) {
				this.onRender(this.$el);
			}

			return this;
		},

		// passageway function for layout
		show: function() {
			if (this.onShow && _.isFunction(this.onShow)) {
				this.onShow(this.$el);
			}

			return this;
		},

		close: function() {
			this.remove();
			this.unbind();

			if (this.onClose && _.isFunction(this.onClose)) {
				this.onClose(this);			
			}

			return this;
		},

		setUI: function(ui) {
			this.ui = (function() {
				var elements;
				for(var el in ui) {
					elements[el] = $(ui[el]);
				}
				return elements;
			})();

			return this;
		}
	});
})();