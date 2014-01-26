Backbone.Tendon.Yield
---------------

Tendon.Yield defines a thin wrapper for adding and removing nested views.  Utilizes a CRUD like interface for managing child views.  All methods accept an options object as their last argument.

_In the future, I think Tendon.Yield should be a promise based api as it would expose a more useful, convenient set of patterns_

__Methods__

- insert (String/Function, view)
- insert (view)
- find (String/Function)
- find (view)
- findAll()
- remove (view)
- remove (String/Function)
- removeAll (options)

##Methods

###find (View/String/Function, options)

Find searches through child views to locate corisponding view(s).  If the view was inserted with a name string, then it can be located using

#####Code

    var AbductorView = new Backbone.Tendon.View({
        onInsert: function() {
            alert("AbductorView inserted by Tendon.Yield")
        }
    });

    app.Vent.on()

    AbductorView.close();


###setUI

Internal method.  Cache dom elements using the ui hash. Implemented using jQuery, but can be overwriten for use with a differnt selector engine.


###render

__Callbacks__

- onInsert (Function)
- onUpdate (Function)
- onRemove (Function)

__Options__

- insertPosition: "before" or "after"
- replace

__Events__

- vent.on("yield:insert", function(yield, view))
- vent.on("yield:update", function(yield, view))
- vent.on("yield:remove", function(yield, view))