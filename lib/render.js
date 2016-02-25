var current;

/**
 *  Default render functions.
 *
 *  @module render
 */

/**
 *  Render a class (or module) block.
 *
 *  @function _class
 *  @param {Object} type The tag that initiated the render.
 *  @param {Object} token The current comment AST token.
 */
function _class(type, token) {
  // TODO: warn here
  if(!type.name) {
    return;
  }

  var state = this.state
    , opts = this.opts
    , isModule = type.tag === this.conf.MODULE;

  if(isModule) {
    state.depth = this.opts.level + 1;
  }

  this.heading(type.name + ' '  + type.description, state.depth);
  this.meta(token);
  if(opts.usage.length) {
    this.usage(opts.usage, opts.lang);
  }
  if(token.description) {
    this.stream.write(token.description); 
    this.newline(2);
  }
  state.depth++;
  this.see(token);
}

/**
 *  Render a function block.
 *
 *  @function _function
 *  @param {Object} type The tag that initiated the render.
 *  @param {Object} token The current comment AST token.
 */
function _function(type, token) {
  // TODO: warn here
  if(!type.name) {
    return;
  }

  var opts = this.opts
    , state = this.state
    , params
    , options
    , level = state.depth
    , inherits
    , isConstructor = (type.tag === this.conf.CONSTRUCTOR)
    , isStatic = (type.tag === this.conf.STATIC)
    , throwables
    , member = this.tags.find(this.conf.PROTOTYPE, token)
    , returns = this.tags.find(this.conf.RETURN, token);

  // format options
  var info = {
      isStatic: isStatic,
      isConstructor: isConstructor,
      inherits: inherits,
      member: member,
      returns: returns,
      currentClass: current
    }
    , format;

  if(isConstructor) {
    current = type;
    inherits = info.inherits = this.tags.find(this.conf.INHERITS, token); 
  }

  format = this.format.method(type, info);

  this.heading(format.title, level);

  // method signature
  params = this.tags.collect(this.conf.PARAM, token);

  this.signature(params, format.signature, opts.lang);
  this.newline(2);

  this.meta(token);

  // method description
  if(token.description) {
    this.stream.write(token.description);
    this.newline(2);
  }

  if(returns) {
    this.stream.write(this.format.returns(returns));
    this.newline(2);
  }

  // parameter list @param
  this.parameters(params);
  if(params.length) {
    this.newline();
  }

  // options list @option
  options = this.tags.collect(this.conf.OPTION, token);
  if(options.length) {
    this.heading(this.conf.title.OPTIONS, level + 1);
    this.parameters(options);
    this.newline();
  }

  throwables = this.tags.collect(this.conf.THROWS, token);

  if(throwables.length) {
    this.heading(this.conf.title.THROWS, level + 1);
    this.parameters(throwables);
    if(params.length) {
      this.newline();
    }
  }

  this.see(token);
}

/**
 *  Render a property block.
 *
 *  @function _property 
 *  @param {Object} type The tag that initiated the render.
 *  @param {Object} token The current comment AST token.
 */
function _property(type, token) {
  // TODO: warn here
  if(!type.name) {
    return;
  }

  var opts = this.opts
    , state = this.state
    , defaultValue = this.tags.find(this.conf.DEFAULT, token)
    , fixed = (type.tag === this.conf.CONSTANT);

  this.heading(type.name, state.depth);
  this.fenced(
    this.format.property(type, defaultValue, fixed), opts.lang) 
  this.newline(2);
  this.meta(token);
  if(token.description) {
    this.stream.write(token.description);
    this.newline(2);
  }

  this.see(token);
}

module.exports = {
  _class: _class,
  _function: _function,
  _property: _property
}
