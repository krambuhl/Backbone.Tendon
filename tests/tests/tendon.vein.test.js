module("Tendon.Vein");

// We are only testing the core functionality 
// that is used in Tendon.  I believe that it 
// is safe to use as long as it passes 
// duck-like and core method tests
 
test("Backbone.Events methods are defined", function() {
	var vein = new Tendon.Vein();
	
	expect(9);
	
	// misguided? ask chris
	notEqual(vein.bind, undefined, "vien.bind is defined");
	notEqual(vein.unbind, undefined, "vien.unbind is defined");

	notEqual(vein.listenTo, undefined, "vien.listenTo is defined");
	notEqual(vein.listenToOnce, undefined, "vien.listenToOnce is defined");
	notEqual(vein.stopListening, undefined, "vien.stopListening is defined");

	notEqual(vein.on, undefined, "vien.on is defined");
	notEqual(vein.once, undefined, "vien.once is defined");
	notEqual(vein.off, undefined, "vien.off is defined");
	notEqual(vein.trigger, undefined, "vien.trigger is defined");
});


test("Events trigger listeners", function() {
	var vein = new Tendon.Vein(),
		count = 0,
		counter = function() { count++; }

	expect(2);

	vein.on("test:event", counter);
	vein.once("test:event", counter);

	vein.trigger("test:event");
	equal(count, 2, "Both `on` and `once` event listeners are triggered");
	
	vein.trigger("test:event");
	equal(count, 3, "Only `on` event listener is triggered")
});


test("Turning off event listeners stops listener from triggering", function() {
	var vein = new Tendon.Vein(),
		count = 0,
		counter = function() { count++; }

	expect(2);

	vein.on("test:event", counter);
	vein.trigger("test:event");

	equal(count, 1, "Event listener is triggered");
	
	vein.off("test:event");
	vein.trigger("test:event");

	equal(count, 1, "After turning off event, event listener is not triggered");
});