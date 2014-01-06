/**
 * The idea of this syntax is a replacement for layoutmanagers like Marionette or Chaplin.
 * It should enable the developer to better seperate View classes from how data is passed 
 * to the view.
 *
 * The templates must be pre-compiled and exist in its own namespace. These templates can be
 * enhanced by the program. They will provide an extra set of utilities and helper functions
 * to define how and where a template is rendered. In a 'controller'-like class you can define
 * when it should be rendered.
 *
 * This way it should be easy to implement the view-rendering on both the server and client while
 * still being dynamic.
 * They're practically 'smart' templates that know on itself where and how to render.
 * 
 */

(function() {


	/************************
	 * ____CONSTRUCTION____ */

	/**
	 * Start by creating a namespace for your views.
	 */
	window.view = new Desperado(options);

	/**
	 * To enhance a template to a Desperado-view use the Desperado function on the object.
	 * The second parameter is the namespace for this template. This can also be sepperated
	 * by points to nest views.
	 */
	view.Desperado(Templates.layout, 'layout');
	view.Desperado(Templates.users.index, 'users.index');

	/**
	 * To compile a complete set of templates, pass in the namespace as second argument
	 */
	window.view = new Desperado(options, Templates);


	/*******************
	 * ____OPTIONS____ */

	/**
	 * By default the 'render()' function will be used to render the templates. This can also be
	 * changed.
	 */
	window.view = new Desperado({
		render: 'generate'
	});


	/********************
	 * ____SETTINGS____ */

	/**
	 * The users.index template will try to render up. By defining layout as its parent it
	 * will render this view inside the layout. If the layout is already present in
	 * the DOM it will replace the content, keeping the state of layout intact.
	 * Parent can also be an element.
	 */
	views.users.index.settings({
		parent: 'layout'
	});
	views.layout.settings({
		parent: document.body
	});

	/**
	 * Use the data property to tell the view on which data it will depend. This way the template
	 * will render normally and can re-render when any of these properties are changed. When a view
	 * is closed and rendered again, the data it had will be lost.
	 */
	view.users.list.settings({
		data: {
			users: null,
			age: null
		}
	});

	/**
	 * Insert will define the way the view is inserted. It defaults to 'replace'. Possible options:
	 * 'replace'               =>   Replace the full content of its parent.
	 * 'append'                =>   Append the content to the end of the content of its parent.
	 * 'prepend'               =>   Prepend the content at the beginning of the content of its parent.
	 * function                =>   A function that will insert the elements itself.
	 * '(append/prepend)Once'  =>   Places the content in it's parent, either at the beginning or end but makes
	 *                              sure this is the only view-app in there. Usefull for inserting a layout.
	 */
	views.popup.settings({
		insert: 'append',
		parent: 'layout'
	});
	views.layout.settings({
		parent: document.body,
		insert: 'appendOnce'
	});


	/*******************************
	 * ____OPENING AND CLOSING____ */

	/**
	 * To show a view, call the method open. This will render the view inside its parent, and that
	 * parent in its own parent, etc.
	 */
	views.users.list.open();

	/**
	 * A view can be closed. Data that has been previously set will be lost and the instance removed.
	 * The elements will be removed from the DOM.
	 * TODO: Specify options to keep the data after closing.
	 */
	views.users.list.close();

	/**
	 * By detaching a view, the view will be removed from the DOM but the event handlers and data
	 * will stay intact. By running open again, the view will be placed back in the DOM and the
	 * data restored.
	 */
	views.users.list.detach();


	/******************************************
	 * ____HTML ATTRIBUTES (EXPERIMENTAL)____ */

	/**
	 * A set of HTML attributes will are required to tell Desperado where to render which view.
	 * (TODO: Maybe this should also be possible to do through javascript only)
	 */
	// The view with name 'main-content' will be rendered inside.
	'<div data-name="main-content"></div>';

	// Render the email object with the view email.sidebar.
	// This will use the existing email.sidebar view.
	'<span data-template="email.sidebar" data-content="email"></span>';

	// Render the users-array with the view users.list.
	// This will instantiate a new 'users.list' view for each item.
	'<ul data-template="users.list" data-list="users"></ul>';

	// Immediately render this child view. Seperate multiple children by space.
	'<div data-child="users.login">';


	/***********************
	 * ____INHERITANCE____ */

	/**
	 * To create a new View from an existing Desperado-view, use the extendTo
	 * function. This will inherit all settings (and maybe the bound classes and
	 * event listeners with an extra argument). The string will be the namespace
	 * for the view.
	 */
	views.layout.extendTo('differentLayout').settings({});


	/************************************************
	 * ____CALLBACKS AND BINDING (EXPERIMENTAL)____ */

	/**
	 * Classes can be bound and unbound to a view. Each time a view is opened (unless detached) the
	 * class will be instantiated. The second parameter is a nonmandatory object of options.
	 * Options:
	 * constructor      => (optional [Object]) will be the function that defines how to create the class.
	 * name             => (optional [String]) to find the instance of the class back, apply a name.
	 */
	view.users.list.bind(BackboneView);
	view.users.list.bind(BackboneView, {
		constructor: function(viewClass, data) {
			// this === view.users.list
			return new viewClass(data);
		},
		name: 'backboneView'
	});
	views.users.list.unbind(BackboneView);


	/**
	 * A list of event listeners is available and can be (un)set with the on and off methods.
	 */
	view.users.list.on('before.open', function() {});
	view.users.list.on('before.close', function() {});
	view.users.list.on('before.render', function() {});
	view.users.list.on('before.detach', function() {});
	view.users.list.on('after.open', function() {});
	view.users.list.on('after.close', function() {});
	view.users.list.on('after.render', function() {});
	view.users.list.on('after.detach', function() {});

	view.users.list.off('after.detach', function() {});


	/**
	 * Data can be set manually on the view. This will cause the view to be re-rendered.
	 * (TODO: Specify an option to turn this auto-re-render off in case a two-way databinding
	 * templatee-ngine is used.)
	 */
	views.users.list.set('users', users);


	/**
	 * Now let's get this party started. In this example we will show a view with a list,
	 * alter the list after a while and show how only the new item gets added.
	 */
	Route.url('/users', function() {
		var users;

		// Calling show on a view will create the view.
		// The view users.list will look at its parent (users.index), where to insert. If it doesn't exist yet
		// users.index will be created and the list inserted in it.
		users = ['Piet', 'Jan'];
		views.users.list.set('users', users);
		views.users.list.show();

		// Peter will automatically be added to the rendered list after 2.5 seconds.
		_.delay(function() {
			users.push('Peter');
		}, 2500);
	});


	/***********************************************************************
	******* END SPECIFICATION, BELOW ARE JUST THOUGHTS AND SCRAMBLES *******
	***********************************************************************/


	/******************************
	 * ____PROBLEMS AND STUFF____ */
	// View doesn't say where in the parent view it should render. A possible solution:
	views.users.index.settings({
		parent: 'layout:main-content'
	});


	// When a part of a view is already rendered with data and another route url re-uses this.
	// It is already in the DOM. How do you know if the data is already there or not?
	// We would want to avoid re-doing things like: views.sections.login.set('user', user);
	// in every controller method.
	// 
	// You probably only have to set it once. This way the view already has teh data needed. So set it
	// e.g. when the user is fetched.
	// 
	// Or do something like this:
	// Idea to make data dependent upon render
	views.sections.login.on('before.render', function() {
		this.set('user', app.user || {});
	});


	// What happens when multiple instances are required. For instance in a list. How do we keep instances
	// accessible?
	// Maybe it should be possible to create a new instance of a view.
	// views.users.list.extendTo(). Leaving the first parameter empty will only return the new instance. Applying a string
	// will also add it to the namespace.

	// Define how data from a parent view can be accesible to a child view. Do they always leak through, should
	// this be an option?
	// 
	// Maybe something like this. It will ask the immediate parent for the data records. If it doesn't exist there, it
	// could bubble up, asking it's parents parent for that data, etc.
	views.users.list.settings({
		parentData: {
			records: null
		}
	});
	// Or specify a different view.
	views.users.list.settings({
		parentData: {
			records: 'views.records.index'
		}
	});

	// When an array(-like) object is passed, it will automatically listen to changes and when the
	// array changes the list will be re-rendered.
	// NOTE: Define this furder down.

	// Solve the problem where each view must have one single root element. Marionette has this
	// problem. Maybe each rendered view can have a unique data-id. This same data-id can be set
	// on the root element(s). The id will be deleted when a view is closed and a new one generated
	// when the view is opened again.

	// Specify options on how to detach views and what to do with data after a view is closed.
	// Also, when it's detached, use an option to make it stop listening for events, or maybe
	// queue them up until it's opened again.

	// Maybe it's cool to create a new view from an existing one by instantiating it:
	// var userItem = new views.users.list(); This could be a lot faster than extendTo().
	// Copying all the properties to a new object seems like a performance hit.


	/*************************
	 * ____REMOVED IDEAS____ */

	/**
	 * This probably makes the whole thing unnecesary complex.
	 * Calling settings with the first parameter as string, will bind the options to just this route.
	 * This will cause the view to re-render if navigated to a different route.
	 */
	views.projects.index.settings('/projects', {
		// Options
	});

	// Binding methods on 'this', will only be bound for this route and will be unbound when moving away.
	// Note: It then becomes framework dependent.
	this.on('views.users.list.render', function() {

	});

	// Desperado won't be a new templating language with two way databinding. That exceeds the scope
	// of this project. Desperado should be powerful but small and maintainable. For now I'll let this
	// here.
	// 
	// In the beginning the script will re-render the whole thing when the data changes. That is just for the
	// convencience of testing the API. This would be an undesired effect. Data should be made dynamic and
	// binded in two-ways. A nice thing would be bindAttr(). Where you can execute a function to assign an
	// attribute (or maybe class?) to an element. In the following case the function will be executed when
	// the variable 'users' changes. Elements with the attribute data-bindAttr="users" will get the result of
	// the functino applied.
	views.users.list.bindAttr({
		users: function(users) {
			return users.length ? 'data-filled="filled"' : '';
		}
	});

})();