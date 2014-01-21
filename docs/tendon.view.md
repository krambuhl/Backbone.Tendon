Backbone.Tendon.View
===============

Tendon.View extends Backbone.View with a set of useful utility functions and common patterns for rending models and templates (if defined).  

_By default the render method uses a precompiled handlebars configuration because it integrates into my grunt enivornmnet well, this function can be easily overwriten to use any templating language._ 

##Methods

###close

Closes and unbinds events from the view.  Fires onClose callback and Vent trigger when done.

#####Code

    var BrisketView = new Backbone.Tendon.View({
        onClose: function() {
            alert("BrisketView Closed.")
        }
    });

    app.Vent.on()

    BrisketView.close();


###setUI

Internal method.  Cache dom elements using the ui hash. Implemented using jQuery, but can be overwriten for use with a differnt selector engine.


###render

Internal method.  Render and set element object.  Implemented using handlebars and Template.js wrapper.  Can be overwritten with custom template engine implimentation.

##Callbacks



###onClose

callback function to be called after the close function is called.


###onRender

callback function to be called after view has been initialized and rendered.


###onShow

callback function to be called after shown using Tendon.

##Options

__ui:__ name value pairs of keys and jquery selectors.


###template

Function or String.  If template is a function, it will be run with options.globals and view model (if defined) in the render function.



