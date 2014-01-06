var nextEntityId = 1;

function FactoryDefinition(name, source) {
  this.name = name;
  this.definition = null;

  this._source = source;
  this._components = [];
  this._defaults = Object.create(null);

  this._sourceHasChanged = true;
  this._componentsHaveChanged = true;
  this._defaultsHaveChanged = true;

  this._entities = [];
}

FactoryDefinition.prototype.create = function FactoryDefinitionCreate(options) {
  var entity = nextEntityId++;

  if (this._sourceHasChanged) {
    this.compile();
  }

  this.definition(entity);

  for (var key in options) {
    if (!(component(key).in(entity))) {
      continue;
    }

    var root = component(key).of(entity),
      paths = options[key];

    for (var path in paths) {
      var properties = path.split('.'),
        length = properties.length - 1,
        dest = root;

      for (var i = 0; i < length; i += 1) {
        dest = dest[properties[i]];
      }

      dest[properties[i]] = paths[path];
    }
  }

  this._entities.push(entity);

  return entity;
};

FactoryDefinition.prototype.source = function FactoryDefinitionSource(value) {
  if (arguments.length === 0) {
    return this._source;
  }

  this._source = value;

  this._sourceHasChanged = true;
  this._componentsHaveChanged = true;
  this._defaultsHaveChanged = true;
};

FactoryDefinition.prototype.components = function FactoryDefinitionComponents() {
  if (this._componentsHaveChanged) {
    var scope = Object.create(null),
      keys = [];

    this._components.length = 0;
    this._components.push.apply(this._components, this._source.components);

    expandSourceProperty(this, 'components', scope, keys);

    for (var i = keys.length - 1; i >= 0; i -= 1) {
      var components = scope[keys[i]];

      outer: for (var j = components.length - 1; j >= 0; j -= 1) {
        var item = components[j];

        for (var k = this._components.length - 1; k >= 0; k -= 1) {
          if (item === this._components[k]) {
            continue outer;
          }
        }

        this._components.push(item);
      }
    }

    this._componentsHaveChanged = false;
  }

  return this._components;
};

FactoryDefinition.prototype.defaults = function FactoryDefinitionDefaults() {
  if (this._defaultsHaveChanged) {
    var scope = Object.create(null),
      keys = [];

    expandSourceProperty(this, 'defaults', scope, keys);

    for (var i = keys.length - 1; i >= 0; i -= 1) {
      var defaults = scope[keys[i]];

      for (var property in defaults) {
        var paths = defaults[property],
          dest;

        if (!(property in this._defaults)) {
          this._defaults[property] = Object.create(null);
        }

        dest = this._defaults[property];

        for (var path in paths) {
          dest[path] = paths[path];
        }
      }
    }

    this._defaultsHaveChanged = false;
  }

  return this._defaults;
};

FactoryDefinition.prototype.compile = function FactoryDefinitionCompile() {
  var head = 'return function ' + this.name + 'Definition($entity) {\n', tail = '}',

    components = this.components(),
    defaults = this.defaults(),

    scope = Object.create(null),
    identifiers = [];

  for (var key in defaults) {
    var identifier = '$' + identifiers.length,
      paths = defaults[key];

    identifiers.push(identifier);

    scope[key] = identifier;

    for (var path in paths) {
      tail = '  ' + identifier + '.' + path + ' = ' + JSON.stringify(paths[path]) + ';\n' + tail;
    }
  }

  head += '  var ' + identifiers.join(', ') + ';\n';

  head += '\n';

  for (var i = components.length - 1; i >= 0; i-= 1) {
    head += '  ';

    if (components[i] in scope) {
      head += scope[components[i]] + ' = ';
    }

    head += 'component("' + components[i] + '").add($entity);\n';
  }

  head += '\n';

  this.definition = new Function('component', head + tail)(function (component) { console.log('get component', component); });

  this._sourceHasChanged = false;
};

function expandSourceProperty(self, property, scope, keys) {
  if (property in self._source) {
    scope[self.name] = self._source.defaults;
    keys.push(self.name);
  }

  if (!('extends' in self._source)) {
    return;
  }

  var stack = self._source.extends.slice();

  while (stack.length > 0) {
    var current = stack.shift(),
      source = factory(current)._source;

    if (current in scope) {
      continue;
    }

    if ('extends' in source) {
      stack.push.apply(stack, source.extends);
    }

    if (property in source) {
      scope[current] = source[property];
      keys.push(current);
    }
  }
}