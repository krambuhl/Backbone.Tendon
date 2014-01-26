var Tendon = Tendon || {};
Tendon.JsonpCollection = (function(o) {
    'use strict';
    
    return Backbone.Collection.extend({
        sync: function(method, model, options) {
            var params = _.extend({
                type: 'GET',
                url: this.url(),
                dataType: "jsonp",
                processData: false
            }, options);

            return $.ajax(params);
        },

        parse: function(response) {
            if (this.type && response[this.type]) {
                return response[this.type];
            } else {
                return response;
            }
        }
    });
}());