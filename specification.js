/**
 * The idea of this syntax is a replacement for layoutmanagers like Marionette or Chaplin.
 * It should enable the developer to better seperate View classes from how data is passed 
 * to the view. Two-way databinding should be supported in its own way.
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


	/**
	 * A template can be compiled to a view(-app) to get enhanced the functionallity.
	 */
	view.layout = new Desperado(Templates.layout);
	// Or compile the complete namespace to a view.
	window.view = new Desperado(Templates);
	// By default the render() function on the template will be used to render the template
	// This can be changed.
	view.layout = new Desperado(Templates.layout, {render: 'generate'});
	
	// Other idea;
	// But where do we store the specific Chappito-instance settings?
	// Each view has to know about the view namespace.
	window.view = new Desperado({
		render: 'render'
	});
	view.Desperado.add(Templates.layout);
	view.Desperado.add(Templates.users.index, 'users.index');
	view.Desperado.add(Templates.users.list, 'users.list');
	view.users.list.settings({
		parent: 'users.index',
		data: {}
	})
	view.users.list.bind(Backbone.View, {
		constructor: function(class) {}
	});

	/**
	 * Each template is considered as a view after compiling. 
	 */
	views.layout.bind({
		parent: document.body
	});
	views.layout.bind({
		parent: document.body,
		insert: 'appendOnce'
	});


	/**
	 * When inheriting from another view, use the extend function.
	 */
	views.differentLayout = views.layout.extend({
		// Specific options
	});
	// (Idea) Alternativly extendTo can be used to do exactly the same.
	views.layout.extendTo('differentLayout').bind({});


	/**
	 * The users.index template will render up. By defining layout as its parent it
	 * will render this view inside the layout. If the layout is already present in
	 * the DOM it will replace the content, keeping the state of layout intact.
	 */
	views.users.index.bind({
		parent: 'layout'
	});


	/**
	 * Calling bind with the first parameter as string, will bind the options to just this route.
	 * This will cause the view to re-render if navigated to a different route.
	 */
	views.projects.index.bind('/projects', {
		// Options
	});


	/**
	 * Use the data property to tell the view on which data it will depend. This way the template
	 * will render normally and can re-render when any of these properties are changed. When a view
	 * is closed and rendered again, the data it had will be lost.
	 */
	views.users.list.bind({
		parent: 'users.index',
		data: {
			users: null,
			age: null
		}
	});

	/**
	 * A view can be closed. Data that has been set previously will be lost and the instance removed.
	 * TODO: Specify options to keep the data after closing.
	 */
	views.users.list.close();

	/**
	 * By detaching a view, the view will be removed from the DOM but the event handlers and data
	 * will stay intact.
	 */
	views.users.list.detach();
	/**
	 * By running show, the view will be placed back in the DOM again.
	 */
	views.users.list.show();


	/**
	 * In the case where you'd want a view to append or prepend to its parent, set insert to
	 * 'append'. Default is 'replace'. Alternativly you can use a function to determine where
	 * to insert the view.
	 */
	views.popup.bind({
		insert: 'append',
		parent: 'layout'
	});


	/**
	 * When an array(-like) object is passed, it will automatically listen to changes and when the
	 * array changes the list will be re-rendered.
	 * NOTE: Define this furder down.
	 */


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
		setTimeout(function() {
			users.push('Peter');
		}, 2500);
	});


	/**
	 * Problems and stuff....
	 */
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


	// TODO: How do you define the template of a collection. Like this or in the DOM with a data
	// attribute. (data-template="views.users.item")
	views.users.list.bind({
		data: {
			users: 'views.users.item',
			users: {
				template: views.users.item,
				data: null
			},
		}
	});


	// Idea; Binding methods on 'this', will only be bound for this route and will be unbound when moving away.
	// Note: It then becomes framework dependent.
	this.on('views.users.list.render', function() {

	});


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


	// What happens when multiple instances are required. For instance in a list. How do we keep isntances
	// accessible?
	// Maybe it should be possible to create a new instance of a view.
	// views.users.list.extend(). Leaving extend() empty will only return the new instance. Applying a string
	// will also add it to the namespace.


	// Solve the problem where each view must have one single root element. Marionette has this
	// problem. Maybe each rendered view can have a unique data-id. This same data-id can be set
	// on the root element(s). The id will be deleted when a view is closed and a new one generated
	// when the view is opened again.


	// Define a pattern on how to load data and where on the client to store this.


	// Specify options on how to detach views and what to do with data after a view is closed.
	// Also, when it's detached, use an option to make it stop listening for events, or maybe
	// queue them up until it's opened again.


	// Other test of binding BackboneViews to the presentation.
	// Maybe bind can be called multiple times. Attaching different kind of View behavior to a
	// view.
	// 
	// In some form, this can be used as a mixin.
	// Here the UsersListView will be instantiated every time the users.list view will be opened. (unless detached).
	// 
	// Blaaaattt this is not good yet.
	var UsersListView = Backbone.View.extend({
		events: {
			'click a.expand': '_loadMore'
		},
		_loadMore: function() {
			var self = this;

			self.data.user.LoadMoreData().done(function(data) {
				// this.view refers to views.users.list. This will be set on the object when created.
				self.view.show({
					extraData: data
				});
			});
		}
	}
	views.users.list.bind(UsersListView);

	// This view can also be unbound.
	views.users.list.unbind(UsersListView);

})();