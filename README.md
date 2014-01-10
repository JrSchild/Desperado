Desperado
=========

A different layout manager to render your templates. Works with different templating languages and javascript frameworks.

The idea of this syntax is a replacement for layoutmanagers like Marionette (ItemView, CollectionView, etc...) or Chaplin. It should enable the developer to better seperate View classes from how data is passed to the view.

The templates must be pre-compiled and exist in its own namespace. These templates can be enhanced by Desperado. They will provide an extra set of utilities and helper functions to define how and where a template should be rendered.

### Benefits
This way it should be easy to implement the view-rendering on both the server and client while still keeping everything highly dynamic. They're practically 'smart' templates that know on itself where and how to render. The benefits are:
* It is fast and small.
* Code becomes less verbose.
* Easier to seperate HTML from logic.
* Works with any templating language.
* Can be used with any javascript framework.
* Can be used on both the server and the client.
* No dependencies except your favorite templating-engine.
* Automatic buffering, delays DOM insertion until completely rendered.

### Browser Support
Basically all browsers that implement querySelectorAll are supported.
* Chrome
* Firefox
* IE 8 and up
* Safari
* Opera
* iOS
* Android

### Dependencies
None, except your favorite template engine!