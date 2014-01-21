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