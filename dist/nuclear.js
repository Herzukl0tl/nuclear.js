(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* events-emitter 30-12-2013 */
!function(a,b){"function"==typeof define&&define.amd?define(function(){return b(a)}):"object"==typeof module&&module&&module.exports?module.exports=b(a):"object"==typeof exports&&exports?exports.EventsEmitter=b(a):a.EventsEmitter=b(a)}(this,function(a){"use strict";function b(){}function c(b,c,d,e,f){var i=h;h+=1,"_listeners"in b||(b._listeners={callbacks:Object.create(null),contexts:Object.create(null),times:Object.create(null)}),"_events"in b||(b._events=Object.create(null)),b._listeners.callbacks[i]=d,b._listeners.contexts[i]=e,5===arguments.length&&(b._listeners.times[i]=f),"_memories"in b&&Array.isArray(b._memories[c])&&(a.setImmediate||a.setTimeout)(function(){g(b,i,b._memories[c])},0);var j=b._events[c];return"number"==typeof j?b._events[c]=[j,i]:Array.isArray(j)?j.push(i):b._events[c]=i,i}function d(a,b,c){var d=(a._listeners.callbacks,a._events[b]);if("number"==typeof d)f(a,d);else if(Array.isArray(d))for(var e=d.length,g=0;e>g;g+=1){var h=d[g];f(a,h)}c||delete a._events[b]}function e(a,b,c){var d=a._listeners.callbacks,e=a._events[b];if("number"==typeof e)e in d||(f(a,e),delete a._events[b]);else if(Array.isArray(e)){for(var g=e.length,h=0;g>h;h+=1){var i=e[h];i in d||(f(a,i),e.splice(h,1),g-=1,h-=1)}0!==g||c||delete a._events[b]}}function f(a,b){delete a._listeners.callbacks[b],delete a._listeners.contexts[b],delete a._listeners.times[b]}function g(b,c,d){if(c in b._listeners.callbacks){var e=b._listeners.callbacks[c],g=b._listeners.contexts[c]||a;switch(c in b._listeners.times&&(b._listeners.times[c]-=1,b._listeners.times[c]<1&&f(b,c)),d.length){case 0:return e.call(g);case 1:return e.call(g,d[0]);case 2:return e.call(g,d[0],d[1]);case 3:return e.call(g,d[0],d[1],d[2]);default:return e.apply(g,d)}}}var h=1;return b.prototype.on=function(b,d,e){return 3===arguments.length?"times"in e?e.times<1?0:c(this,b,d,e.context||a,e.times):c(this,b,d,e.context||a):c(this,b,d,a)},b.prototype.once=function(b,d,e){return 3===arguments.length?c(this,b,d,e.context||a,1):c(this,b,d,a,1)},b.prototype.off=function(a){return"_listeners"in this&&a in this._listeners.callbacks?(delete this._listeners.callbacks[a],delete this._listeners.contexts[a],delete this._listeners.times[a],!0):!1},b.prototype.clear=function(a,b){if("_listeners"in this&&"_events"in this){var c,f;switch(arguments.length){case 0:for(a in this._events)d(this,a,!1);break;case 1:if("string"==typeof a)d(this,a,!1);else if(Array.isArray(a))for(f=a.length;f--;)d(this,a[f],!1);else{b=a,c=b.soft||!1;for(a in this._events)b.ghosts?e(this,a,c):d(this,a,c)}break;case 2:if(c=b.soft||!1,"string"==typeof a)b.ghosts?e(this,a,c):d(this,a,c);else if(Array.isArray(a))for(f=a.length;f--;)b.ghosts?e(this,a[f],c):d(this,a[f],c)}}},b.prototype.listeners=function(a){var b=[];if(!("_listeners"in this&&"_events"in this))return b;var c=this._listeners.callbacks,d=this._events[a];if("number"==typeof d)d in c?b.push(c[d]):f(this,d);else if(Array.isArray(d))for(var e=d.length,g=0;e>g;g+=1){var h=d[g];h in c?b.push(c[h]):f(this,h)}return b},b.prototype.remember=function(a){if("_memories"in this||(this._memories=Object.create(null)),Array.isArray(a))for(var b=a.length;b--;)this._memories[a[b]]=null;else this._memories[a]=null},b.prototype.forget=function(a){if("_memories"in this)if(Array.isArray(a))for(var b=a.length;b--;)delete this._memories[a[b]];else delete this._memories[a]},b.prototype.trigger=function(a){var b=Array.prototype.slice.call(arguments,1);if("_memories"in this&&a in this._memories&&(this._memories[a]=b),!("_listeners"in this&&"_events"in this))return!1;var c=this._events[a];if("number"==typeof c)g(this,c,b);else{if(!Array.isArray(c))return!1;for(var d=c.length,e=0;d>e;e+=1){var f=c[e];g(this,f,b)}}return!0},b.mixins=function(a){var c=b.prototype;for(var d in c)a[d]=c[d];return a},b.mixins(b),b});
},{}],2:[function(require,module,exports){
'use strict';

var nuclearEvents = require('./nuclear.events');

/**
 * Component constructor
 * This is the components factory
 * @param {string} name       The component name
 * @param {function} definition The component function which has to return its instance
 */
function Component(name, definition) {
  this.name = name;
  this.definition = definition;

  this._components = Object.create(null);
  this._disabledComponents = Object.create(null);
}

/**
 * Return the component of the wanted entity if it has a component of this factory
 * If the options key 'required' is true, the method throw an error if the entity hasn't the component
 * If the options key 'add' is true, the method add the component to the entity and return it
 * @param  {number} entity  The entity which has the component
 * @param  {object} options The method options
 * @return {object/undefined}         Return the component if the entity has it, if it hasn't,
 * return undefined if th required key is false
 */
Component.prototype.of = function ComponentOf(entity, options) {
  var component = this._components[entity] || this._disabledComponents[entity];

  if (arguments.length === 2) {
    if (!this. in (entity)) {
      if (options.required) throw new Error();
      else if (options.add) component = this.add(entity);
    }
  }

  return component;
};

/**
 * Test if an entity has the component of this factory
 * @param  {number} entity The entity to test
 * @return {boolean}        True if the entity has it, fals if it hasn't
 */
Component.prototype. in = function ComponentIn(entity) {
  return entity in this._components || entity in this._disabledComponents;
};

/**
 * The method to add a component to an existing entity
 * All the arguments after the entity one will be passed to the component definition call
 * The component creation triggers a 'add:'componentName event on the component part of core
 * @param {number} entity The entity which will get the new component
 * @return {object}       The created component
 */
Component.prototype.add = function ComponentAdd(entity) {
  if (this. in (entity)) throw new Error();

  var component = this.definition.apply(this, arguments);

  this._components[entity] = component;

  nuclearEvents.trigger('component:add:' + this.name, entity, this.name);
  nuclearEvents.trigger('component:add', entity, this.name);
  
  return component;
};

/**
 * Remove the component of this factory to the selected entity
 * The component destruction triggers a 'remove:'ComponentName event on the component part of core
 * @param  {number} entity The entity which will lost the component
 * @return {boolean}        Return false if the entity hasn't the component, true in other case
 */
Component.prototype.remove = function ComponentRemove(entity) {
  if (!this. in (entity)) return false;

  delete this._components[entity];
  delete this._disabledComponents[entity];

  nuclearEvents.trigger('component:remove:' + this.name, entity, this.name);
  nuclearEvents.trigger('component:remove', entity, this.name);
  return true;
};

/**
 * Share an attached component to one or several entity(ies)
 * @param  {number} source The source entity, owning the component to share
 * @param  {number/array} dest   The selected entity(ies)
 * @return {object/null}        If the source has the component, it returns it, in other case, it returns null
 */
Component.prototype.share = function ComponentShare(source, dest) {
  if (!this. in (source)) return null;

  var component = this.of(source);

  if (Array.isArray(dest)) {
    var i;
    for (i = dest.length - 1; i >= 0; i -= 1) {
      this._components[dest[i]] = component;
      nuclearEvents.trigger('component:add:' + this.name, dest[i], this.name);
      nuclearEvents.trigger('component:add', dest[i], this.name);
    }
  } else {
    this._components[dest] = component;
    nuclearEvents.trigger('component:add:' + this.name, dest, this.name);
    nuclearEvents.trigger('component:add', dest, this.name);
  }

  return component;
};

/**
 * Disable the component of the selected entity
 * @param  {number} id The selected entity
 * @return {boolean}    If the entity owns the component and it is enabled, it returns true, in other case, it returns false
 */
Component.prototype.disable = function ComponentDisable(id) {
  if (id in this._components) {
    this._disabledComponents[id] = this._components[id];
    delete this._components[id];

    nuclearEvents.trigger('component:disable:' + this.name, id, this.name);
    return true;
  }
  return false;
};

/**
 * Enable the component of the selected entity
 * @param  {number} id The selected entity
 * @return {boolean}    If the entity owns the component and it is disabled, it returns true, in other case, it returns false
 */
Component.prototype.enable = function ComponentEnable(id) {
  if (id in this._disabledComponents) {
    this._components[id] = this._disabledComponents[id];
    delete this._disabledComponents[id];

    nuclearEvents.trigger('component:enable:' + this.name, id, this.name);
    return true;
  }
  return false;
};

/**
 * Test if the component of the selected entity is enabled or not
 * @param  {number}  id The selected entity
 * @return {Boolean}    True if it's enabled, false in other case
 */
Component.prototype.isEnabled = function ComponentIsEnabled(id) {
  if (this. in (id)) {
    if (id in this._components) return true;
    return false;
  }

  throw new Error();
};

module.exports = Component;

},{"./nuclear.events":9}],3:[function(require,module,exports){
'use strict';

function EntityIdGenerator(seed) {
  this._seed = seed || 0;
  this._value = this._seed;
}

EntityIdGenerator.prototype.next = function entityIdGeneratorNext() {
  return (this._value += 1);
};

EntityIdGenerator.prototype.reset = function entityIdGeneratorReset() {
  this._value = this._seed;
};


module.exports = EntityIdGenerator;

},{}],4:[function(require,module,exports){
'use strict';

var EntityIdGenerator, entityIdGenerator, nuclearEvents;

EntityIdGenerator = require('./entity-id-generator');
entityIdGenerator = new EntityIdGenerator();
nuclearEvents = require('./nuclear.events');

/**
 * The Entity constructor
 * @param {string} name   The Entity name
 * @param {Object} source The Entity config
 */
function Entity(name, definition) {
  this.name = name;
  this.definition = definition || function defaultDefinition(){};
}

Entity.next = function entityNext() {
  return entityIdGenerator.next();
};

/**
 * Create an entity depending on this Entity
 * @param  {object} options All the components data
 * @return {number}         The created entity
 */
Entity.prototype.create = function entityCreate(options) {
  var id = Entity.next();
  this.definition(id, options);

  nuclearEvents.trigger('entity:create:' + this.name, id);
  nuclearEvents.trigger('entity:create_entity', id, this.name);

  return id;
};

/**
 * Enhance an entity with this factory definition
 * @param  {number} entity The entity to enhance
 * @param  {object} data Data to configure components
 * @return {number}            The entity to enhance
 */
Entity.prototype.enhance = function entityEnhance(entity, data) {
  this.definition(entity, data);

  return entity;
};

module.exports = Entity;

},{"./entity-id-generator":3,"./nuclear.events":9}],5:[function(require,module,exports){
'use strict';

var nuclear, Module;

module.exports = nuclear = {};

Module = require('./module');

nuclear.events    = require('./nuclear.events');
nuclear.registry  = require('./nuclear.registry');
nuclear.component = require('./nuclear.component');
nuclear.entity    = require('./nuclear.entity');
nuclear.system    = require('./nuclear.system');

nuclear.module = function nuclearModule(name, deps) {
  var module;

  if (arguments.length === 1) {
    return this.registry.module(name);
  }

  module = new Module(name, deps);

  return module;
};

nuclear.import = function nuclearImport(modules) {
  var i, length;

  length = modules.length;

  for (i = 0; i < length; i += 1) {
    this.registry.import(modules[i]);
  }
};

},{"./module":6,"./nuclear.component":7,"./nuclear.entity":8,"./nuclear.events":9,"./nuclear.registry":10,"./nuclear.system":11}],6:[function(require,module,exports){
'use strict';

var Component, Entity, System;

Component = require('./component');
Entity = require('./entity');
System = require('./system');

function Module(name, deps) {
  this.name = name.trim();
  this.requires = deps;

  this.components = Object.create(null);
  this.entities = Object.create(null);
  this.systems = Object.create(null);

  this._config = Object.create(null);
}

Module.prototype.config = function moduleConfig(config) {
  var key, descriptor;

  if (typeof config === 'string') {
    return this._config[key = config];
  }

  for (key in config) {
    descriptor = Object.getOwnPropertyDescriptor(config, key);
    if (descriptor) Object.defineProperty(this._config, key, descriptor);
  }

  return this;
};

Module.prototype.component = function moduleComponent(name, factory) {
  var component;

  if (arguments.length === 1) {
    component = this.components[name];

    if (component) return component;

    throw new Error();
  }

  if (name in this.components) {
    throw new Error();
  }

  this.components[name] = new Component(name, factory);

  return this;
};

Module.prototype.entity = function moduleEntity(name, factory) {
  var entity;

  if (arguments.length === 1) {
    entity = this.entities[name];

    if (entity) return entity;

    throw new Error();
  }

  if (name in this.entities) {
    throw new Error();
  }

  this.entities[name] = new Entity(name, factory);

  return this;
};

Module.prototype.system = function moduleSystem(name, components, definition, options) {
  var system;

  if (arguments.length === 1) {
    system = this.systems[name];

    if (system) return system;

    throw new Error();
  }

  if (name in this.systems) {
    throw new Error();
  }

  this.systems[name] = new System(name, components, definition, options);

  return this;
};

module.exports = Module;

},{"./component":2,"./entity":4,"./system":13}],7:[function(require,module,exports){
'use strict';

var registry = require('./nuclear.registry'),
    nuclearEvents = require('./nuclear.events'),
    entityList = Object.create(null);

/**
 * The nuclearComponent method which contains all Component definition
 * This is also the nuclearComponents definition getter (throws an error if the Component doesn't exist)
 * @param  {string} name The Component name
 * @return {object}      The selected Component
 */
function nuclearComponent(name) {
  return registry.component(name);
}

/**
 * Get all the selected entity nuclearComponents
 * @param  {number} id The selected entity
 * @return {array}    A simple string array containing all the nuclearComponents names of the selected entity
 */
nuclearComponent.all = function nuclearComponentOf(id) {
  if (entityList[id]) return entityList[id];

  throw new Error();
};

function linkComponent(id, name) {
  var components = entityList[id] || [];
  components.push(name);
  entityList[id] = components;
}

function unLinkComponent(id, name) {
  var components = nuclearComponent.all(id);
  var index = components.indexOf(name);

  components.splice(index, 1);
}

nuclearEvents.on('component:add', linkComponent);
nuclearEvents.on('component:remove', unLinkComponent);

module.exports = nuclearComponent;
},{"./nuclear.events":9,"./nuclear.registry":10}],8:[function(require,module,exports){
'use strict';

var registry = require('./nuclear.registry'),
    nuclearComponent = require('./nuclear.component'),
    Entity = require('./entity'),
    nuclearEvents = require('./nuclear.events');

/**
 * The nuclearEntity method which contains all entities definitions
 * This is also the nuclearEntity definition getter (throws an error if the Entity doesn't exist)
 * @param  {string} name The Entity name
 * @return {object}      The selected Entity
 */
function nuclearEntity(name) {
  return registry.entity(name);
}

/**
 * Serialize the selected nuclearEntity
 * @param  {number} id The selected nuclearEntity
 * @return {string}    The serialized nuclearEntity
 */
nuclearEntity.serialize = function nuclearEntitySerialize(id) {
  var serialized = Object.create(null),
    components = nuclearComponent.all(id); //change .of to .all here

  serialized.id = id;
  serialized.options = Object.create(null);

  for (var i = components.length - 1; i > 0; i--) {
    var name = components[i];
    var definition = nuclearComponent(name);
    var data = definition.of(id);

    if (typeof data.toJSON === 'function') data = data.toJSON();
    serialized.options[name] = data;
  }

  return JSON.stringify(serialized);
};

/**
 * Deserialize a serialized nuclearEntity
 * @param  {string} serialized The serialized nuclearEntity
 * @return {number}            The created nuclearEntity id
 */
nuclearEntity.deserialize = function nuclearEntityDeserialize(serialized) {
  serialized = JSON.parse(serialized);
  var id = nuclearEntity.create(serialized.options);

  return id;
};

/**
 * Remove the selected nuclearEntity and its components
 * @param  {number} id The selected nuclearEntity
 * @return {boolean}    Return true
 */
nuclearEntity.remove = function nuclearEntityRemove(id) {
  var components = nuclearComponent.of(id);

  for (var i = components.length - 1; i >= 0; i -= 1) {
    nuclearComponent(components[i]).remove(id);
  }

  nuclearEvents.trigger('entity:remove', id);
  return true;
};

nuclearEntity.create = function nuclearEntityCreate(options){
  var id = Entity.next(),
      i;
  for(i in options){
    nuclearComponent(i).add(id, options[i]);
  }

  return id;
};

module.exports = nuclearEntity;

},{"./entity":4,"./nuclear.component":7,"./nuclear.events":9,"./nuclear.registry":10}],9:[function(require,module,exports){
'use strict';

var EventsEmitter;

EventsEmitter = require('../../lib/events-emitter.min');

module.exports = new EventsEmitter();

},{"../../lib/events-emitter.min":1}],10:[function(require,module,exports){
'use strict';

var Registry;

Registry = require('./registry');

module.exports = new Registry();

},{"./registry":12}],11:[function(require,module,exports){
'use strict';

var registry = require('./nuclear.registry'),
    nuclearEvents = require('./nuclear.events');

/**
 * The nuclearSystem method which contains all nuclearSystem definitions
 * This is also the nuclearSystem definition getter (throws an error if the System doesn't exist)
 * @param  {string} name The System name
 * @return {object}      The selected System
 */
function nuclearSystem(name) {
  return registry.system(name);
}

/**
 * Define the run priority of the selected nuclearSystem
 * @param  {string} name The selected System name
 * @param  {number} prio The priority of the nuclearSystem
 */
nuclearSystem.priority = function nuclearSystemPriority(name, prio) {
  if (arguments.length === 1) {
    return nuclearSystem(name)._priority;
  }

  nuclearSystem(name)._priority = prio;
  registry._systemList.sort(nuclearSystemsPriorityComparator);
};

function nuclearSystemsPriorityComparator(a, b) {
  return a._priority - b._priority;
}

/**
 * Run all the nuclearSystem list
 */
nuclearSystem.run = function nuclearSystemRun() {
  nuclearEvents.trigger('system:before_running', nuclearSystem._list);
  var x;
  for (x = 0; x < registry._systemLength; x++) {
    nuclearSystem(registry._systemList[x]).run();
  }
  nuclearEvents.trigger('system:after_running', registry._systemList);
};

/**
 * Disable a nuclearSystem in the nuclearSystem list
 * @param  {string} name The System name
 */
nuclearSystem.disable = function nuclearSystemDisable(name) {
  var index = registry.systems.indexOf(name);
  registry.systems.splice(index, 1);
};

module.exports = nuclearSystem;

},{"./nuclear.events":9,"./nuclear.registry":10}],12:[function(require,module,exports){
'use strict';

var rExplicitModuleNotation;

rExplicitModuleNotation = /([^\s]+)\s+from\s+([^\s]+)/;

function Registry() {
  this.modules = Object.create(null);
  this.components = Object.create(null);
  this.entities = Object.create(null);
  this.systems = Object.create(null);
  
  this._systemList = [];
  this._systemLength = 0;
}

Registry.prototype.import = function registryImport(module) {
  var length, i, storages, storage, source, dest, key;

  if (module.name in this.modules) return;

  length = module.requires.length;

  for (i = 0; i < length; i += 1) {
    if (!(module.requires[i] in this.modules)) {
      throw new Error();
    }
  }

  this.modules[module.name] = module;

  storages = ['components', 'entities', 'systems'];

  for (i = 0; (storage = storages[i]); i += 1) {
    source = module[storage];
    dest = this[storage];

    for (key in source) {
      if(storage === 'systems'){
        this._systemList.push(key +' from '+module.name);
        ++this._systemLength;
      }
      dest[key] = source[key];
    }
  }
};

Registry.prototype.clear = function registryClear() {
  var storages, i, storage, source, key;

  storages = ['modules', 'components', 'entities', 'systems'];

  for (i = 0; (storage = storages[i]); i += 1) {
    source = this[storage];

    for (key in source) {
      delete source[key];
    }
  }
};

Registry.prototype.module = function registryModule(name) {
  var module;

  module = this.modules[name];

  if (module) return module;

  throw new Error();
};

Registry.prototype.component = function registryComponent(name) {
  var component;

  if (rExplicitModuleNotation.test(name)) {
    return this.module(RegExp.$2).component(RegExp.$1);
  }

  component = this.components[name];

  if (component) return component;

  throw new Error();
};

Registry.prototype.entity = function registryEntity(name) {
  var entity;

  if (rExplicitModuleNotation.test(name)) {
    return this.module(RegExp.$2).entity(RegExp.$1);
  }

  entity = this.entities[name];

  if (entity) return entity;

  throw new Error();
};

Registry.prototype.system = function registrySystem(name) {
  var system;

  if (rExplicitModuleNotation.test(name)) {
    return this.module(RegExp.$2).system(RegExp.$1);
  }

  system = this.systems[name];

  if (system) return system;

  throw new Error();
};

module.exports = Registry;

},{}],13:[function(require,module,exports){
'use strict';

var nuclearComponent = require('./nuclear.component'),
    nuclearSystem = require('./nuclear.system'),
    nuclearEvents = require('./nuclear.events'),
    eventsOptions = {};

/**
 * The System constructor
 * @param {string} name       The System name
 * @param {array} components The System required components
 * @param {function} definition The System definition
 * @param {object} options    The System options
 */
function System(name, components, definition, options) {
  options = options || {};
  
  this.name = name;
  this.definition = definition;
  this.components = components;

  this._context = Object.create(options.context || null);

  this.entities = [];
  this._deferredEntities = [];
  this._sorterManager = Object.create({
    comparator: function () {},
    toDeferred: false
  });

  this._componentPacks = Object.create(null);
  this._removeEntities = Object.create(null);

  this._priority = 0;

  // this._scheduler = new Scheduler(options.msPerUpdate, options.strict, options.extrapolation);
  // this._scheduler.start();

  systemListenComponents(this, components);

  if (options.disable !== undefined) {
    systemDisableSystems(this, options.disable);
  }

  nuclearEvents.on('system:after_running', function () {
    if (this._sorterManager.toDeferred) {
      this.entities.sort(this._sorterManager.comparator);
      this._sorterManager.toDeferred = false;
    }
  }, {
    context: this
  });
}

/**
 * Check if the entity parameter is valid for this system
 * If No : return false
 * If Yes : add the entity to the entities list of the system, and return true
 * @param {number} entity The entity to add
 */
System.prototype.add = function SystemAdd(entity) {
  if (this.entities.indexOf(entity) > -1) return false;

  var componentPack = this.check(entity);
  if (componentPack === null) return false;

  this.entities.push(entity);
  this._componentPacks[entity] = componentPack;

  return true;
};

/**
 * Remove the selected entity frome the system garbage list
 * @param  {number} entity The selected entity
 * @return {boolean}        If the entity is in the system, it returns true, in other case, it returns false
 */
System.prototype.remove = function SystemRemove(entity) {
  var index = this.entities.indexOf(parseInt(entity));
  if (index < 0) return false;

  this.entities.splice(index, 1);
  delete this._componentPacks[entity];

  return true;
};

/**
 * Check if an entity is runnable by the system
 * @param  {number} entity The selected entity
 * @return {null/object}   Return null if the entity isn't runnable, return its components in other case
 */
System.prototype.check = function SystemCheck(entity) {
  var componentPack = Object.create(null),
      i, comp;
      
  for (i = this.components.length - 1; i >= 0; i--) {
    comp = nuclearComponent(this.components[i]).of(entity);
    
    if (comp === undefined) return null;
    
    componentPack[this.components[i]] = comp;
  }

  return componentPack;
};

/**
 * Run the system on the selected entity, or on all the entities if no arguments
 * @param  {number} entity The selected entity
 * @return {System} Return the System itself
 */
System.prototype.run = function SystemRun(entity) {
  var self = this;
  systemParseDeferred(self);

  if (arguments.length === 1) {
    if (this.entities.indexOf(entity) !== -1) {
      var componentPack = self._componentPacks[entity];
      nuclearEvents.trigger('system:before:' + self.name, entity, componentPack);
      systemDefinitionRunEntity(self, entity, componentPack);
      nuclearEvents.trigger('system:after:' + self.name, entity, componentPack);
      return true;
    }
    return false;
  } else {
    nuclearEvents.trigger('system:before:' + self.name, self.entities, self._componentPacks);

    if (self._autosortComparator !== null) {
      self.entities.sort(self._autosortComparator);
    }

    var length = self.entities.length;

    for (var i = 0; i < length; i++) {
      // self._context._deltaTime = deltaTime;
      systemDefinitionRunEntity(self, self.entities[i], self._componentPacks[self.entities[i]]);
    }

    nuclearEvents.trigger('system:after:' + self.name, self.entities, self._componentPacks);
  }

  return self;
};

/**
 * Sort the internal entity list of the system
 * @param  {function} comparator The sorting function
 * @return {System}    The System itself
 */
System.prototype.sort = function SystemSort(comparator) {
  this._sorterManager.comparator = comparator;
  this._sorterManager.toDeferred = true;

  return this;
};

/**
 * Define an autosort compartor which will sort the System
 * at each frame
 * @param  {function} comparator The sorting function
 * @return {System}    The System itself
 */
System.prototype.autosort = function SystemAutoSort(comparator) {
  if (arguments.length === 0) {
    return this._autosortComparator;
  }

  this._autosortComparator = comparator.bind(this._context);

  return this;
};

/**
 * Refresh the system entities list
 */
System.prototype.refresh = function SystemRefresh() {
  systemParseDeferred(this);
};

function systemDefinitionRunEntity(self, entity, componentPack) {
  var context = self._context,
    components = self.components;

  for (var i = components.length - 1; i >= 0; i--) {
    context[components[i]] = componentPack[components[i]];
  }


  self.definition.call(context, entity);
}

function systemParseDeferred(self) {
  var entity;
  for (var i = 0; i < self._deferredEntities.length; i++) {
    entity = self._deferredEntities[i];
    if (self._removeEntities[entity] !== undefined) {
      self.remove(entity);
      delete self._removeEntities[entity];
      continue;
    }

    self.add(entity);
  }

  self._deferredEntities.length = 0;
}

function systemAddToDeferred(entity) {
  this._deferredEntities.push(entity);// jshint ignore:line
}

function systemAddToDeferredAndRemove(entity, componentName) {
  this._deferredEntities.push(entity);// jshint ignore:line
  this._removeEntities[entity] = componentName;// jshint ignore:line
}

function systemListenComponents(self, components) {
  var options = eventsOptions,
      i;

  options.context = self;
      
  for (i = 0; i < components.length; i++) {
    nuclearEvents.on('component:add:' + components[i], systemAddToDeferred, options);
    nuclearEvents.on('component:enable:' + components[i], systemAddToDeferred, options);
     
    nuclearEvents.on('component:remove:' + components[i], systemAddToDeferredAndRemove, options);
    nuclearEvents.on('component:disable:' + components[i], systemAddToDeferredAndRemove, options);
  }
}

function systemDisableSystems(self, systems) {
  for (var i = 0; i < systems.length; i++) {
    nuclearSystem.disable(systems[i]);
  }
}

module.exports = System;

},{"./nuclear.component":7,"./nuclear.events":9,"./nuclear.system":11}],14:[function(require,module,exports){
'use strict';

var pool, watchers;

pool = require('./pool');
watchers = require('./modules/core.watchers');

window.nuclear = require('./core/index');

window.nuclear.import([watchers]);

window.Pool = pool.Pool;
window.FixedPool = pool.FixedPool;

},{"./core/index":5,"./modules/core.watchers":15,"./pool":20}],15:[function(require,module,exports){
'use strict';

var nuclear, WatcherComponent, watchSystem;

nuclear = require('./../../core/index');
WatcherComponent = require('./watcher-component');
watchSystem = require('./watch-system');

module.exports = nuclear.module('core.watchers', [])
  .component('watcher', function (e) {
    return new WatcherComponent(e);
  })
  .system('watch', ['watchers'], watchSystem);

},{"./../../core/index":5,"./watch-system":16,"./watcher-component":17}],16:[function(require,module,exports){
'use strict';

function watchSystem(e) {
  /*jshint validthis: true*/
  var records, path, record, value;

  records = this.watcher.records;

  for (path in records) {
    record = records[path];
    value = record.getter(e);

    if (value !== record.old) {
      record.listener(value, record.old);
    }

    record.old = value;
  }
}

module.exports = watchSystem;

},{}],17:[function(require,module,exports){
'use strict';

var nuclear;

nuclear = require('./../../core/index');

function WatcherComponent(id) {
  this.entity = id;
  this.records = Object.create(null);
}

WatcherComponent.prototype.watch = function watcherComponentWatch(path, listener) {
  var paths;

  if (typeof path === 'string') {
    this._watch(path, listener);
  } else {
    paths = path;
    for (path in paths) {
      this._watch(path, paths[path]);
    }
  }
};

WatcherComponent.prototype._watch = function _watcherComponentWatch(path, listener) {
  var getter, setter, value, record;

  if (path in this.records) {
    throw new Error('A watcher is already defined for the ' + path + ' path');
  }

  getter = compileGetter(path);
  setter = compileSetter(path);

  value = getter(this.entity);

  record = {
    path: path,
    listener: listener,
    getter: getter,
    setter: setter,
    old: value
  };

  this.records[path] = record;
};

function compileGetter(path) {
  var getter, fragments;

  getter = compileGetter.cache[path];

  if (!getter) {
    fragments = path.split('.');

    compileGetter[path] = getter = new Function('n', 'return function compiledGetter(e) {' +
        'return n.component("' + fragments.shift() + '").of(e).' + fragments.join('.') +
      '}'
    )(nuclear);
  }

  return getter;
}

compileGetter.cache = Object.create(null);

function compileSetter(path) {
  var setter, fragments;

  setter = compileSetter.cache[path];

  if (!setter) {
    fragments = path.split('.');

    compileSetter.cache[path] = setter = new Function('n', 'return function compiledSetter(e,v) {' +
        'return n.component("' + fragments.shift() + '").of(e).' + fragments.join('.') + '=v' +
      '}'
    )(nuclear);
  }

  return setter;
}

compileSetter.cache = Object.create(null);

WatcherComponent.prototype.unwatch = function watcherComponentUnwatch(path) {
  var paths;

  if (arguments.length === 0) {
    this.records = {};
  } else if (typeof path === 'string') {
    this._unwatch(path);
  } else {
    paths = path;
    for (path in paths) {
      this._unwatch(path);
    }
  }
};

WatcherComponent.prototype._unwatch = function _watcherComponentUnwatch(path) {
  var record;

  record = this.records[path];

  if (record) {
    delete this.records[path];
  } else {
    throw new Error('There is no watcher defined for the ' + path + ' path');
  }
};

module.exports = WatcherComponent;

},{"./../../core/index":5}],18:[function(require,module,exports){
'use strict';

function FixedPool(factory, options) {
  var i;

  this._pool = [];

  this._defered = [];

  if (arguments.length === 2) {
    if ('size' in options) this._size = options.size;
    else this._size = FixedPool.defaults.size;
  } else {
    this._size = FixedPool.defaults.size;
  }

  for (i = 0; i < this._size; i += 1) {
    this._pool.push(factory());
  }
}


FixedPool.prototype.create = function fixedPoolCreate() {
  var instance;

  if (this._size > 0) {
    instance = this._pool[--this._size];

    this._pool[this._size] = null;

    return instance;
  }
};

FixedPool.prototype.defer = function fixedPoolDefer(callback) {
  var instance;

  if (this._size > 0) {
    instance = this._pool[--this._size];

    this._pool[this._size] = null;

    (setImmediate || setTimeout)(function () {
      callback(instance);
    }, 0);
  } else {
    this._defered.push(callback);
  }
};

FixedPool.prototype.release = function fixedPoolRelease(instance) {
  if (this._defered.length > 0) {
    this._defered.shift()(instance);
  } else {
    this._pool[this._size++] = instance;
  }
};

FixedPool.prototype.size = function fixedPoolSize() {
  return this._pool.length;
};

FixedPool.prototype.freeSize = function fixedPoolFreeSize() {
  return this._size;
};

FixedPool.prototype.allocatedSize = function fixedPoolAllocatedSize() {
  return this._pool.length - this._size;
};


FixedPool.defaults = {
  size: 100
};


module.exports = FixedPool;

},{}],19:[function(require,module,exports){
'use strict';

function Pool(factory, options) {
  this._factory = factory;

  this._pool = [];

  this._defered = [];

  if (arguments.length === 2) {
    if ('size' in options) this._size = options.size;
    else this._size = Pool.defaults.size;

    if ('growth' in options) this.growth = options.growth;
    else this.growth = Pool.defaults.growth;

    if ('threshold' in options) this.threshold = options.threshold;
    else this.threshold = Pool.defaults.threshold;
  } else {
    options = Pool.defaults;

    this._size = options.size;

    this.growth = options.growth;
    this.threshold = options.threshold;
  }

  this.allocate(this._size);
}


Pool.prototype.create = function poolCreate() {
  if (this._pool.length < this.threshold) {
    this.allocate(this.growth);
  }

  return this._pool.pop();
};

Pool.prototype.defer = function poolDefer(callback) {
  var instance;

  if (this._pool.length > 0) {
    instance = this._pool.pop();
    (setImmediate || setTimeout)(function () {
      callback(instance);
    }, 0);
  } else {
    this._defered.push(callback);
  }
};

Pool.prototype.allocate = function poolAllocate(count) {
  var i;

  for (i = 0; i < count; i += 1) {
    this._pool.push(this._factory());
  }

  this._size += count;
};

Pool.prototype.release = function poolRelease(instance) {
  if (this._defered.length > 0) {
    this._defered.shift()(instance);
  } else {
    this._pool.push(instance);
  }
};

Pool.prototype.size = function poolSize() {
  return this._size;
};

Pool.prototype.freeSize = function poolFreeSize() {
  return this._pool.length;
};

Pool.prototype.allocatedSize = function poolAllocatedSize() {
  return this._size - this._pool.length;
};


Pool.defaults = {
  size: 100,
  growth: 1,
  threshold: 1
};


module.exports = Pool;

},{}],20:[function(require,module,exports){
'use strict';

exports.Pool = require('./Pool');
exports.FixedPool = require('./FixedPool');

},{"./FixedPool":18,"./Pool":19}]},{},[14]);