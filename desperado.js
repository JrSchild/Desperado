(function(undefined) {

	/**
	 * Constructor
	 */
	window.Desperado = function(options) {
		this.Desperado.options = options;
		this.Desperado.views = this;
	};

	/**
	 * Enhance/add function on Desperado instance.
	 * Todo: enhance with paths.
	 */
	Desperado.prototype.Desperado = function(template, namespace) {
		this[namespace] = new Desperado.View(template, this);
		return this[namespace];
	};
	Desperado.prototype.Desperado.settings = function(name, settings) {
		return this;
	};
	Desperado.prototype.Desperado.getChildView = function(name) {
		var parts, parent;

		if (typeof name === 'string') {
			parts = name.split(':');
			parent = this.views[parts[0]];
			return parent.children.get(parts[1]);
		} if (name.nodeType) {
			if (!name.viewContainer) {
				name.viewContainer = new Desperado.Child();
				name.viewContainer.element = name;
			}
			return name.viewContainer;
		}
	};
	Desperado.insertMethods = {
		replace: function(childView) {
			// Close other views first.
			this.closeChildren();
			this.views.push(childView);
			this.element.insertBefore(childView.element);
		},
		append: function(childView) {
			console.log('appendd');
			this.views.push(childView);
			this.element.appendChild(childView.element);
		},
		prepend: function(childView) {
			this.views.push(childView);
			this.element.insertBefore(childView.element, this.element.firstChild);
		}
	};

	// Thanx Ben Alman
	Desperado.getObject = function( parts, create, obj ) {
		var p;

		if (typeof parts === 'string') {
			parts = parts.split('.');
		}

		if (typeof create !== 'boolean') {
			obj = create;
			create = false;
		}

		while (obj && parts.length) {
			p = parts.shift();

			if (obj[p] === undefined && create) {
				obj[p] = {};
			}
			obj = obj[p];
		}

		return obj;
	}

	Desperado.setObject = function( name, value, context ) {
		var parts = name.split('.'),
			prop = parts.pop(),
			obj = Desperado.getObject( parts, true, context );

		// Only return the value if it is set successfully.
		return obj && typeof obj === 'object' && prop
			? ( obj[prop] = value ) : undefined;
	};
	Desperado.isPlainObject = function(obj) {
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}
		try {
			if ( obj.constructor &&
					!({}).hasOwnProperty.call(obj.Constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			return false;
		}
		return true;
	}

	/**
	 * View class.
	 */
	Desperado.View = function(template, namespace) {
		this.template = template;
		this.namespace = namespace;
		this.settings = new Desperado.GSetter('settings');
		this.data = new Desperado.GSetter('data');
		this.children = new Desperado.Children(this);
	};
	Desperado.View.prototype = {
		/**
		 * Cached element of the top level element of this view.
		 * @type {Node}
		 */
		element: null,

		/**
		 * Determine if this view is open or not.
		 * @type {Boolean}
		 */
		opened: false,

		/**
		 * Determine if the view has been rendered
		 * @type {Boolean}
		 */
		rendered: false,

		/**
		 * Open this view and render inside its parents.
		 * @return {View}
		 */
		open: function() {
			console.log('open', this);
			var targetView;

			this.render();
			targetView = this.namespace.Desperado.getChildView(this.settings().parent);
			Desperado.insertMethods[this.settings().insert].call(targetView, this);
			if (targetView.parent && !targetView.parent.opened) {
				targetView.parent.open();
			}
			this.opened = true;
			return this;
		},

		close: function(options) {
			console.log('close', this);
			if (this.opened) {
				this.element.parentNode.removeChild(this.element);
				this.opened = false;
			}
			return this;
		},

		render: function(force) {
			var temp;

			if (!this.rendered || force) {
				temp = document.createElement('div');
				temp.innerHTML = this.template(this.serialize());
				this.element = temp.childNodes[0];
				this.rendered = true;
				this.children.initialize(true);
			}
			return this;
		},

		// Now we're just using this.settings().data. But really we should merge
		// this with this.data (The data that will be set on the view.)
		serialize: function() {
			return this.settings('data');
		},
		extendTo: function(name) {
			var view, key;
			view = new Desperado.View(this.template, this.namespace);
			for (key in this.settings()) {
				view.settings(key, this.settings(key));
			}
			return view;
		}
	}

	/**
	 * (Temporary) creating a getter-setter function to store data.
	 */
	Desperado.GSetter = function(namespace) {
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
				return this;
			}
		};
		ff[namespace] = {};
		return ff;
	}


	/**
	 * Object that holds the children of a view.
	 */
	Desperado.Children = function(view) {
		this.view = view;
	};

	Desperado.Children.prototype = {
		initialized: false,
		view: null,
		initialize: function(force) {
			var key,
				settings = this.view.settings('children');
	
			if (this.view) {
				this.view.render();
			}

			if (!this.initialized || force) {
				this.initialized = true;

				for (key in settings) {
					this[key] = this[key] || new Desperado.Child(this.view);
					this[key].element = this.view.element.querySelector(settings[key]);
				}
			}
		},
		get: function(name) {
			if (this.view) {
				this.view.render();
			}
			return this[name];
		},

		// Render the children that should automatically be rendered.
		renderAutomaticChildren: function() {}
	}

	Desperado.Child = function(parent) {
		this.parent = parent;
		this.views = [];
		this.queue = [];
	};
	Desperado.Child.prototype = {
		element: null,
		views: null,
		queue: null,
		parent: null,
		get: function() {},
		queuePush: function(view) {},
		queuePop: function() {},
		pushChild: function(view) {},
		closeChildren: function(options) {
			var i = 0, l;

			if (this.views && this.views.length) {
				l = this.views.length;
				for (; i < l; i++) {
					this.views[i].close(options);
				}
				// Remove from views array without destroying instance.
				this.views = [];
			}
		}
	}

})();
