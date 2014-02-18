Backbone.Tendon Intents
======

####Required Modules

Component | Description | Status
--- | --- | ---
Tendon | Namespace definition | Done, Closed
Tendon.Vein | Message passer | Done, Closed
Tendon.View | Base view class | Done, Open
Tendon.Yield | Extends Tendon.View to manage child views | In-Progress
Tendon.CollectionView | Extend Tendon.Yield/Tendon.View to list/item structure | Not Started
Tendon.Composer | Application object | In-Progress


####Optional/Utility Modules

Component | Description | Status
--- | --- | ---
Tendon.JsonpCollection | Readonly jsonp collection | Done, Closed



Composer
---

Composer is the application object, only one should be alive.  it is the primary messaging bus between router and application.  It follows a very typical site sctructure of /page/action/id.

* Tendon.Composer (extends Tendon.Layout)
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

    // define the views/controllers` that are used when routes are fired
    // name: [view, options] ==> controllers.name = new view(options)
    controllers: { // default = {}
        blog: [MyApp.BlogCollectionView, { collection: MyApp.BlogCollection }],
        about: { view: MyApp.AboutView }
    },

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
        "@controller": ".js-yield-page",
        footer: ".js-yield-footer"
    }
});

```


Layout
---

Layout is a view wrapper for adding and removing child views.  Handles the 


* Composer
    + Vien
    + Yield
    + Router

#####Intended Code

```js

// useage:
MyApp.AppLayout = Tendon.Layout.extend({
    block: {
        header: ".l-header",
        navigation: ".l-navigation",
        content: ".l-content",
        footer: ".l-navigation",
    },

});

//definition:
Tendon.Layout = Tendon.Yield.extend({

    show
});
```



