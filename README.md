#Backbone.Fiber

Backbone.Fiber is a small set of Backbone objects to quickly get off the ground.  It is a lightweight implimentation inspired by some good parts of Marionette and enough new parts to call it something new.


##Backbone.Fiber.View

A base view that defines an automatic renderer if templates are defined and close and render hooks. 

###Methods

- __close:__ closes and unbinds events from the view.
- __setUI:__ Internal method.  Cache dom elements using the ui hash. Implemented using jQuery, but can be overwriten for use with a differnt selector engine.
- __render:__ Internal method.  Render and set element object.  Implemented using handlebars and Template.js wrapper.  Can be overwritten with custom template engine implimentation.

###Callbacks

- __onClose:__ callback function to be called after the close function is called.
- __onRender:__ callback function to be called after view has been initialized and rendered.

###Options

- __ui__: name value pairs of keys and jquery selectors.
- __template:__ Function or String.  If template is a function, it will be run with options.globals and view model (if defined) in the render function.


Backbone.Fiber.Yield
---------------

Yield defines a basic interface for adding and removing child nodes.  


Backbone.Fiber.Router
---------------

Fiber.Router is an method-based router that uses Backbone.Wreqw for messaging and deligating application state.

###Methods

- __addMethod:__
- __removeMethod:__
- __addMethod:__

###Options

- __methods:__





