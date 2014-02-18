// Via: https://github.com/marionettejs/backbone.wreqr/blob/master/lib/backbone.wreqr.js
// The spirit of Tendon is a no fils setup, wreqr does too much, but the EventAggregator is perfectly utilitarian

Tendon.Vein = (function(o) {
    'use strict';

    var Vein = function() { };

    // Copy the `extend` function used by Backbone's classes
    Vein.extend = Backbone.View.extend;

    // Copy the basic Backbone.Events on to the event aggregator
    _.extend(Vein.prototype, Backbone.Events);

    return Vein;
}());