var template = "<div><div id=\"<%= id %>\" class=\"block\"><%= url %></div></div>";
var model = new Backbone.Model({ id: 0, url: "#awesome" });
var workarea;

var TestView = Tendon.View.extend({
	template: _.template(template),
	model: model
});

module("Tendon.View", {
	setup: function() {
		workarea = $("#qunit-workspace");
	}, 
	teardown: function() {
		workarea.empty();
	}
});

asyncTest("Tendon.View instance options override view methods and properties", function() {
	expect(1);

	var view = new TestView({
		render: function() {
			ok(true, "View contstructor option overrides default method");
			start();
		}
	});
});


asyncTest("Tendon.View.render() is called with model and template string", function() {
	expect(1);

	var view = new TestView({
		template: template,
		onRender: function() {
			notEqual(this.$el.find("#" + this.model.get("id")).length, 0, "Template is rendered with model attributes");
			start();
		}
	});
});


asyncTest("Tendon.View.render() is called with model and template function", function() {
	expect(1);

	var view = new TestView({
		template: _.template(template),
		onRender: function() {
			notEqual(this.$el.find("#" + this.model.get("id")).length, 0, "Template is rendered with model attributes");
			start();
		}
	});
});


asyncTest("Tendon.View.onRender() is called with proper arguments", function() {
	expect(3);

	var view = new TestView({
		onRender: function(thisView, el) {
			equal(this, view, "callback function is called with view as context");
			equal(thisView, view, "first argument of callback is the view");
			equal(el, view.$el, "second argument of callback is the view's jquery el");
			start();
		}
	});
});


asyncTest("Tendon.View.vein `render` event is called with proper arguments", function() {
	expect(2);

	var view = new TestView();

	view.vein.on("render", function(thisView, el) {
		equal(thisView, view, "first argument of callback is the view");
		equal(el, view.$el, "second argument of callback is the view's jquery el");
		start();
	})
});


test("Tendon.View.close() removes view from dom", function() {
	expect(2);

	// create and add view to workarea
	var view = new TestView();
	workarea.append(view.$el);
	
	// verify view was added
	notEqual(workarea.find("#" + view.model.get("id")).length, 0, "View is added to workarea");

	// close and remove view
	view.close();

	// verify view was removed
	equal(workarea.find("#" + view.model.get("id")).length, 0, "Template is closed and removed to work area");
});


asyncTest("Tendon.View.onClose() is called with proper arguments", function() {
	expect(2);

	// create view
	var view = new TestView({
		onClose: function(thisView) {
			equal(this, view, "callback function is called with view as context");
			equal(thisView, view, "first argument of callback is the view");

			start();
		}
	});

	// add view to workarea
	workarea.append(view.$el);

	// close and remove view
	view.close();
});


asyncTest("Tendon.View.vein `close` event is called with proper arguments", function() {
	expect(1);

	var view = new TestView();

	view.vein.on("close", function(thisView) {
		equal(thisView, view, "first argument of callback is the view");
		start();
	});

	// add view to workarea
	workarea.append(view.$el);

	// close and remove view
	view.close();
});

asyncTest("Tendon.View.ui is defined with cached jquery objects", function() {
	expect(3);

	var view = new TestView({
		ui: {
			block: ".block"
		},
		events: {
			"click @ui.block": "onClick"
		},
		onRender: function() {
			notEqual(this.ui.block, undefined, "test ui object is defined");
			ok(this.ui.block instanceof jQuery, "test ui object is a jquery object");
			notEqual(this.ui.block.length, 0, "test ui object has reference to correct sub element");
			this.ui.block.on("click", this.onClick);

			this.ui.block.trigger("click")

		},

		onClick: function() {
			debugger;
			// start();
		}
	});
});

/*



//ui is set proper
// @ui rules work in view.events object
Tendon.View.state() sets view el class




*/