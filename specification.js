(function() {


	/************************
	 * ____CONSTRUCTION____ */

	/**
	 * Start by creating a namespace for your views.
	 */
	window.views = new Desperado(options);

	/**
	 * To enhance a template to a Desperado-view use the Desperado function on the object.
	 * The second parameter is the namespace for this template. This can also be sepperated
	 * by points to nest views.
	 */
	views.Desperado(Templates.layout, 'layout');
	views.Desperado(Templates.users.index, 'users.index');

	/**
	 * To compile a complete set of templates, pass in the namespace as second argument
	 */
	window.views = new Desperado(options, Templates);


	/*******************
	 * ____OPTIONS____ */

	/**
	 * By default the 'render()' function will be used to render the templates. This can also be
	 * changed.
	 * Default: 'render'
	 */
	window.views = new Desperado({
		render: 'generate'
	});

	/**
	 * AutoReRender will let the templates re-render themselves automatically when data changes.
	 * This will re-instantiate classes that are bound (see below, bind).
	 * Default: 'true'
	 */
	window.views = new Desperado({
		autoReRender: true
	});

	/********************
	 * ____SETTINGS____ */

	/**
	 * The users.index template will try to render up. By defining layout as its parent it
	 * will render this view inside the layout. If the layout is already present in
	 * the DOM it will replace the content, keeping the state of layout intact.
	 * Parent can also be an element.
	 * Default: ''
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
	 * Default: {}
	 */
	views.users.list.settings({
		data: {
			users: null,
			age: null
		}
	});

	/**
	 * Insert will define how the content of the view is inserted. Possible options:
	 * 'replace'               =>   Replace the full content of its parent.
	 * 'append'                =>   Append to the end of the content of its parent.
	 * 'prepend'               =>   Prepend at the beginning of the content of its parent.
	 * function                =>   A function that will insert the elements itself.
	 * '(append/prepend)Once'  =>   Either appends or prepends, but makes sure this is the only
	 *                              view-app, so it has no siblings. Useful for inserting a layout.
	 * Default: 'replace'
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
	 * A set of HTML attributes are required to tell Desperado where to render which view.
	 * (TODO: Maybe this should only be possible to do through javascript)
	 * Update: See for Javascript API at defining children below.
	 */
	// The view with name 'main-content' will be rendered inside.
	'<div data-name="main-content"></div>';

	// Render the email object with the view email.sidebar.
	// This will use the existing email.sidebar view.
	'<span data-template="email.sidebar" data-content="email"></span>';

	// Render the users-array with the view users.list.
	// This will instantiate a new 'users.list' view for each item.
	'<ul data-template="users.list" data-list="users"></ul>';

	// Render the users.login view as child. Seperate multiple children by space.
	'<div data-child="users.login"></div>';


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
	 * constructor      => (optional [Func]) will be the function that defines how to create the class.
	 * destructor       => (optional [Func, String]) function to execute when view is closed and instance destroyed.
	 *                     Could be a string-name of the destructor function of the class.
	 * name             => (optional [String]) to find the instance of the class back, apply a name.
	 */
	views.users.list.bind(function() {});
	views.users.list.bind(BackboneView);
	views.users.list.bind(BackboneView, {
		constructor: function(viewClass) {
			return new viewClass(this.data);
		},
		destructor: 'destroy',
		name: 'backboneView'
	});
	views.users.list.unbind(BackboneView);


	/**
	 * A list of event listeners is available and can be (un)set with the on and off methods.
	 */
	views.users.list.on('before.open', function() {});
	views.users.list.on('before.close', function() {});
	views.users.list.on('before.render', function() {});
	views.users.list.on('before.detach', function() {});
	views.users.list.on('after.open', function() {});
	views.users.list.on('after.close', function() {});
	views.users.list.on('after.render', function() {});
	views.users.list.on('after.detach', function() {});

	views.users.list.off('after.detach', function() {});


	/**
	 * Data can be set manually on the view. This will cause the view to be re-rendered
	 * unless autoReRender is set to false. The arguments can be a name and value or simply
	 * one object with all key - value pairs.
	 */
	views.users.list.set('users', users);
	views.users.list.set({users: users});


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
	********** SOME OF THIS STUFF WILL BE MOVED TO THE SPEC ABOVE **********
	***********************************************************************/

	/*****************************
	 * ____DEFINING CHILDREN____ */

	var index = views.users.index;
	/**
	 * Settings of children should be defined through setters. Children will be defined as following.
	 * An object with in the key the name of the container and value either as
	 * selector or as an object with the following settings:
	 *      selector: Selector of container.
	 *      view:     Name of view to render inside. If this option is set, the view will
	 *                be automatically rendered inside.
	 *      data:     Data passed to the view from the parent, in string, sepperated by spaces,
	 *                if empty, the whole object will be passed.
	 *      insert:   Insert method to be used. If it's set, the insert method of the child will be ignored. 
	 *                Values can be:
	 *                    1) One of the already specified methods: append, prepend, replace, (append|prepend)Once.
	 *                    2) A function. Function must define how the view is placed in the DOM, but also keep
	 *                       it in the same order in the view array as in the DOM.
	 *                    3) A custom method. (as string) defined on this view (not the child view)
	 *                       IDEA: Place all insert methods on a namespace, e.g: views.Desperado.insertMethods[methodName].
	 *                             This way the views will stay 'dumb' and contain as less logic as possible.
	 *      list:     (Requires view to be set.) When list property provided, a list of the views will be created with the specified
	 *                variable. Each view will be copied. Data property will still work. Seperate value by ':'
	 *                followed by the name of target variable-name.
	 */
	index.settings('children', {
		mainContent: '.main-content',
		sidebar: '.sidebar',
		users: {
			selector: '#list-users',
			view: 'users.listItem',
			data: 'users records',
			list: 'users.models:user',
			insert: 'customInsert'
		}
	});
	index.settings({
		children {}
	});

	// Custom insert method.
	// Note: This isn't good.
	index.customInsert(each) {
		this.data.users.each(function(i, value) {
			each('user', value);
		});
	};

	// Both return the children-settings.
	index.settings('children');
	index.settings.children;


	/**
	 * The actual data of the children will be stored straight on the view itself.
	 * It's not intended to interact with this data straight away, but through
	 * accessors.
	 * It will contain the following data:
	 * 		element: A cached node element of the container.
	 * 		views:   The views in an array currently rendered in this container.
	 * 		queue:   A queue as array of views, that want to be rendered inside this container.
	 * 		         When rendering, the latest view can decide to 'kick' out the other views.
	 * 		methods: Accessor and other convenience methods.
	 * 		         Most of the time these functions will only be used internally.
	 */
	index.children.mainContent = {
		element: nodeElement,
		views: [
			view1,
			view2
		],
		queue: [],
		parent: index,
		get: function(name) {},
		queuePush: function(view) {},
		queuePop: function() {},
		pushChild: function(view) {} // lol taht name.
	};
	index.children('mainContent').get(views.user.profile);
	// Get nearest view in views array wrapped around this element.
	index.children('mainContent').get(nodeElment);
	index.children('mainContent').pushChild(view);


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
		this.set('user', app.user || null);
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
	// When parentData is set the view will automatically listen for changes on views.records.index and will re-set
	// that data if it changes.

	// Ways to restore the views from the DOM. It should be possible to transfer the rendered state from the
	// server to the client. Most likely through data attributes.
	// From the server:
	'<div data-view="views.users">
		<ul>
			<li data-view="users.listItem" data-view-id="425532" data-view-data="{user: {name: "Joram"}}"></li>
			<li data-view="users.listItem" data-view-id="987987" data-view-data="{user: {name: "Peter"}}"></li>
			<li data-view="users.listItem" data-view-id="682910" data-view-data="{user: {name: "Paul"}}"></li>
		</ul>
	</div>'
	// When data-view-id is specified it means it's a generated instance of the view users.list.
	// After initializing all the views run views.Desperado.restore(); to restore all the view objects.

	// When an array(-like) object is passed, it will automatically listen to changes and when the
	// array changes the list will be re-rendered.
	// NOTE: Define this furder down.

	// Solve the problem where each view must have one single root element. Marionette has this
	// problem. Maybe each rendered view can have a unique data-id. This same data-id can be set
	// on the root element(s). The id will be deleted when a view is closed and a new one generated
	// when the view is opened again.
	// One idea to make this work: when the template is rendered, get all root elements and place
	// them in a NodeList. This NodeList will be used as 'root-element' when the view is closed
	// or detached. When inserting new root-elements in this view, they must be inserted in the
	// NodeList as well as in the DOM. One problem this exposes is that frameworks don't have a single
	// root element anymore. Backbone for instance, will require one root element in a Backbone-View
	// to e.g. bind events. This is not the responsibility of Desperado to fix.

	// Specify options on how to detach views and what to do with data after a view is closed.
	// Also, when it's detached, use an option to make it stop listening for events, or maybe
	// queue them up until it's opened again.

	// Maybe it's cool to create a new view from an existing one by instantiating it:
	// var userItem = new views.users.list(); This could be a lot faster than extendTo().
	// Copying all the properties to a new object seems like a performance hit.
	
	// Design an API to tell what to do with a list view. Maybe you'd want to update a list
	// of Desperado-views manually. It should probably have the functions: add, delete, refresh.


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


	/*************************************
	 * ____DESPERADO.JS IPHONE NOTES____ */

	// - Make sure buffering is optimized
	// - Option to put everything in data attributes on the elements, for restoring the app from server to client
	// - Specify function to render template
	// API for rendering template differently. Provide own function

	// Way to work with Backbone:
	view.user.on('before:set', function(data) {
		if (data instanceof Backbone.Model) {
			data.on('change', this.reRender);
		}
	});
	view.Desperado.on('before:render', function() {});

	// Other accessor methods.
	// Problem: you won't get parent back. Unless childview contains property to parent view.
	view.Desperado.getChildViewContainer('layout:main-content');
	view.Desperado.getView('users.index').children('main-content');
	
	// Other idea that will cause problems.
	view.Desperado.get('users.index');
	view.Desperado.get('users.index:main-content');
	// If 


	// Create a function to re-render the view (and its children) without having to re-instantiate late bound classes.

	// Data: The data that was set on the view.
	// Classes: All instantiated classes that have been bound to the view.
	// Children: The childviews that have been attached to the view.
	// Elements: The elements that have been rendered.
	//           Keeping them might become complicated. What happens when the data changes.
	//           Will the views be re-renderd even though they're not in the DOM?
	// Listeners: What listeners...?
	view.user.close({
		data: false,
		classes: false,
		children: true,
		elements: false,
		listeners: false // ??
	});

	// When data has been set on the view.
	views.users.list.on('before.set', function(data) {});
	views.users.list.on('after.set', function(data) {});

	// Some way to cancel events?
	// {
	//     event: false
	// }

	// Transitions; before:close. Delay closing? By returning a promise

	// this.data = data currently set.
	// this.settings.data = default data send to templates, unless overwritten in this.data.
	
	views.users.list.bind(BackboneView, {
		name: 'backboneView'
		constructor: function(viewClass, data) {},
		destructor: function(viewClass) {},
		pause: function(viewClass) {},
		resume: function(viewClass) {},
	});

	// Pass in the new settings object in extendTo. If the first property is set, it will
	// overwrite that value. The last parameter contains properties set on the view directly
	// that should be copied over. Could be:
	//     * data: currently set on the view
	//     * classes: that are bound
	//     * events: eventhandlers set
	// This will return the new instance.
	views.layout.extendTo({
		data: null,
		parentData: null,
		parent: null
	}, ['classes', 'data']);
	// Alternativily the first paramater can be a string with a namespace-name to set the
	// the new view on the views object.
	views.layout.extendTo('newLayout', {
		parent: null
	});


	// Global events on the view namespace.
	// Fires after a view has been created and the bound classes instantiated.
	views.Desperado.once('view:created', function(view) {});
	views.Desperado.on('view:show', function(view) {});
	views.Desperado.on('view:destroy', function(view) {});
	views.trigger('show:users.index');


	// Better would be to make namespaces an object not a function with data.
	// 
	// Rather than:
	views.Desperado(Templates.index);
	// Do:
	views.Desperado.add(Templates.index);

	// Getting and setting settigns:
	views.index.settings(); // returns views.index.settings.settigns
	views.index.settings('children'); // returns views.index.settings.settings.children
	views.index.settings.set('children', {}); // Only overwrite current children settings.
	views.index.settings.set('children.users', {}); // Only overwrite current children.users settings.
	views.index.settings({children: {}}); // Throws away current settings and just sets children.

	// Setting and getting data set on the view works just like that:
	views.index.data(); // Return current data set.

	// The correct place to store the views namespace is:
	views.index.namespace = views;
	// Instead of
	views.index.views = views;

function f(namespace) {
	var ff = function(name, data) {
		if (name === undefined) {
			return ff[namespace];
		}
		if (typeof name === 'string') {
			if (data === undefined) {
				return ff[namespace][name];
			} else {
				ff[namespace][name] = data;
				return this;
			}
		}
		if (typeof name === 'object') {
			ff[namespace] = name;
		}
	};
	ff[namespace] = {};
	return ff;
}

window.settings = new f('data');
settings('name', 'henk').settings('age', 15);
settings('name');
settings({city: 'Amsterdam'});
settings();

	// TOOODOOOOOO:
	// Create View on basis from element. How the hell iz we gonna use an element as parent...?


	// Code examples
	//      How to mix it into existing backbone/angular/ember-applications.
	//      After Angular has rendered
	//      epoxyjs (how me gonna solve that, delegate view rendering to a different class)

	// Other Desperado plugin classes, that can simply be bound to a view.
	// Backbone listeners for auto-update.
	// Transitions
	// Asynchronous loading templates
	//      Set root url


	/******************************
	 * ____LAYOUT MANAGER API____ */
	var detailed = new Backbone.LayoutManager({
		template: '#detailed-tmpl',
		name: "detailed",
		views: {
			'': [
				new HeaderView(),
				new ContentView(),
				new FooterView()
			],
			'.list': new TweetsView({tweets: tweetModel})
		}
	});
	detailed.setView('.list', new TweetsView())

	serialize = function() {
		return {tweets: this.data.tweets};
	}
	render = function() {
		return this.template.render(this.serialize());
	}
	// ugly IMO. Rather than listening to the model straight away it re-sets it and calls render again manually.
	list.bind('update', function(model) {
		deatil.model = model;
		detail.render();
	});

})();