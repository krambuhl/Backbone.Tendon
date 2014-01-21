#Backbone.Tendon

Backbone.Tendon is a small set of Backbone objects to quickly get off the ground.  It is a lightweight implimentation inspired by some good parts of Marionette with enough new parts to call it something new.



##Backbone.Tendon.View

Tendon.View extends Backbone.View with a set of useful utility functions and common patterns for rending models and templates (if defined).  

_By default the render method uses a precompiled handlebars configuration because it integrates into my grunt enivornmnet well, this function can be easily overwriten to use any templating language._

__Methods__ 

- close
- setUI (Used Internally)
- render (Used Internally)

__Callbacks__ 

- onClose (Function)
- onRender (Function)

__Options__ 

- ui (Object)
- template (Function/String)



Backbone.Tendon.Yield
---------------

Tendon.Yield defines a thin wrapper for adding and removing nested views.  Utilizes a CRUD like interface for managing child views.  All methods accept a callback option that is called after action has been complete. 

_In the future, I think Tendon.Yield should be a promise based api as it would expose a more useful, convenient set of patterns_

__Methods__

- find (String/Function, options)
- find (view, options)
- findAll(options)
- insert (String/Function, view, options)
- insert (view, options)
- update (view, String/Function, options)
- update (String/Function, String/Function, options)
- remove (view, options)
- remove (String/Function, options)
- removeAll (options)

__Callbacks__

- onInsert (Function)
- onUpdate (Function)
- onRemove (Function)

__Options__

- insertPosition: "before" or "after"

__Events__

- vent.on("yield:insert", function(yield, view))
- vent.on("yield:update", function(yield, view))
- vent.on("yield:remove", function(yield, view))


Backbone.Tendon.AppRouter
---------------

Tendon.AppRouter is an method-based router that uses [Backbone.Wreqw](https://github.com/marionettejs/backbone.wreqr) for messaging and deligating application state.  This acts as an automatic message passer for a predefined set of methods.  Tendon.AppRouter can be used in conjunction with Tendon.Yeild to manage application state.

__Methods__

- addMethod (String/Array)
- removeMethod (String/Array)

__Options__ 

- vent (Required)
- methods (Object)
- depth (Number)





