;(function() {
	var Coil = new Function,
		fnModel = function(o) {
			var c = Object.create(this);
			var m = _.bind(fnModel, c);
			m.__proto__ = _.merge(c, o || {});
			return m;
		},
		fnView = function(o) {
			var c = Object.create(this);
			c.el = $('<div>');
			var v = _.bind(fnView, c);
			v.__proto__ = _.merge(c, o || {});
			v.registerEvents();
			return v;
		},
		Model = fnModel,
		View = fnView;

	Model.prototype = _.extend(Model.prototype, EventEmitter.prototype, {
		extend: function(model) {
			return this(model);
		},
		set: function(key, value) {
			this[key] = value;
			this.emit('change');
		},
		get: function(key) {
			return this[key];
		}
	});

	View.prototype = _.extend(View.prototype, {
		model: new Model,
		template: _.template(''),
		render: function() {
			this.el.html(this.template(this.model));
			return this;
		},
		extend: function(view) {
			return this(view);
		},
		on: {},
		events: {},
		change: function() {
			this.render();
		},
		registerEvents: function() {
			var self = this;
			_.forIn(this.events, function(value, key) {
				value = value.trim();
				key = key.trim();
				var ev;
				if (ev = key.match(/([A-Za-z_][A-Za-z_0-9]+)\/([^\s]*)/))
					self.el.on(ev[1], ev[2], _.bindKey(self, value));
				else if (ev = key.match(/([A-Za-z_][A-Za-z_0-9]+)/))
					self.el.on(ev[1], _.bindKey(self, value));
			});

			this.model.on('change', function() {
				self.render();
			});
		}
	});

	Coil.prototype = _.extend(Coil.prototype, {
		Model: new Model,
		View: new View,
		CollectionView: new View({
			view: new View,
			collection: [],
			render: function() {
				var self = this;
				this.el.empty();
				_.each(this.collection, function(item) {
					self.el.append(self.view({
						model: item
					}).render().el);
				});
			},
			add: function(item) {
				this.collection.push(item);
				return this;
			}
		})
	});

	window.Coil = new Coil;
})();
