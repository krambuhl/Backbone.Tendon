Backbone.Tendon Intents
======


Yield
---

_Extends Tendon.View_

#####Intended Code

```js

// useage:
MyApp.Yield = Tendon.Yield.extend();

// add view to yield (named by view's cid)
MyApp.Yield.insert(new MyApp.HeroView());

// add view with a name to reference
MyApp.Yield.insert("content", new MyApp.ContentView());

// replace with new view
MyApp.Yield.replace("content", new MyApp.NewContentView());

// remove view by name
MyApp.Yield.remove("content");

```


###Todo

- Remove view by reference, even when added with a name string.
- Replace should maintain order.
- CRUD methods should fire off vein methods to self and child views


Layout
---

_Uses Tendon.Yield_

Layout is a view wrapper that creates a set Tendon.Yields of 

#####Intended Code

```js

// useage:
MyApp.AppLayout = Tendon.Layout.extend({
    layout: {
        header: ".l-header",
        navigation: ".l-navigation",
        content: ".l-content",
        footer: ".l-footer",
    }
});

// 

```



    

Composer
---

Composer is the application object, only one should be alive.  it is the primary messaging bus between router and application.  It follows a very typical site sctructure of /page/action/id.

* Tendon.Composer (extends Tendon.View)
    + Vien
    + Router


#####Intended Code

```js
Tendon.Composer.extend({
    // can select prerendered html with selector
    el: ".selector",
    
    // or auto render with an app template
    template: _.template("<% template_source %>"),

    // define application routes 
    // these translate url scheme to controllers
    // route "hero" firing when navigating to "/hero"
    routes: ["blog", "about"],

    // defines default route, if not defined
    // will default to the first route defined
    defaultRoute: "blog"

    // define views instances that will be yielded
    // during application's lifespan
    children: { // default: { }
        header: new MyApp.HeaderView(),
        navigation: new MyApp.NavigationView(),
        footer: new MyApp.NavigationView(),
    },

    // define where yield views should be 
    // yielded too.  @controller defines the
    // container where controllers will be yielded
    layout: {
        header: ".js-yield-header",
        navigation: ".js-yield-navigation",
        content: ".js-yield-page",
        footer: ".js-yield-footer"
    }
});

```
