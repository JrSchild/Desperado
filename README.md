Desperado
=========

A different layout manager to render your templates. Works with different templating languages and javascript frameworks.

The idea of this syntax is a replacement for layoutmanagers like Marionette or Chaplin. It should enable the developer to better seperate View classes from how data is passed to the view.

The templates must be pre-compiled and exist in its own namespace. These templates can be enhanced by the program. They will provide an extra set of utilities and helper functions to define how and where a template is rendered. In a 'controller'-like class you can define when it should be rendered.

This way it should be easy to implement the view-rendering on both the server and client while still being dynamic. They're practically 'smart' templates that know on itself where and how to render.
