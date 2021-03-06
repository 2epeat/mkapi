var currentClass;

/**
 *  Default render functions.
 *
 *  Render functions are called asynchronously and must invoke the callback
 *  function to process the next comment.
 *
 *  @module render
 */

/**
 *  Render a class (or module) block.
 *
 *  @function _class
 *  @param {Object} type The tag that initiated the render.
 *  @param {Object} token The current comment AST token.
 *  @param {Function} cb Callback function.
 */
function _class(type, token, cb) {
  var state = this.state
    , info = token.getInfo()
    , title = type.name;

  if(type.type) {
    if(this.render[type.type] instanceof Function) {
      return this.render[type.type].call(this, type, token, cb);
    }
  }

  if(info.inherits) {
    title = this.format.inherits(type, info);
  }

  if(info.isModule) {
    state.depth = this.opts.level + 1;
    state.inModule = state.depth;
  }

  if(info.isClass) {
    currentClass = type;
    // depth relative to module declaration
    if(state.inModule) {
      state.depth = state.inModule + 1;
    // reset to base level
    }else{
      state.depth = this.opts.level;
    }
  }

  this.heading(title, state.depth);

  this.usage(token.collect(this.conf.USAGE), this.state.lang);

  this.describe(type, token);
  this.meta(token);

  state.depth++;
  this.see(token, state.depth);
  cb();
}

/**
 *  Render a function block.
 *
 *  @function _function
 *  @param {Object} type The tag that initiated the render.
 *  @param {Object} token The current comment AST token.
 *  @param {Function} cb Callback function.
 */
function _function(type, token, cb) {
  var opts = this.opts
    , state = this.state
    , level = state.depth
    , params
    , options
    , throwables
    , events
    // format options
    , info = token.getInfo(true)
    , format
    , title;

  //console.dir(type);
  //console.dir(info);

  if(info.isConstructor) {
    currentClass = type;
    if(info.inherits) {
      title = this.format.inherits(type, info);
    }
  }

  // inherit from current class
  if(info.isMember && !info.isMember.name && currentClass) {
    info.isMember.name = currentClass.name;
  }

  format = this.format.method(type, info);

  if(!title && format) {
    title = format.title;
  }

  this.heading(title, level);

  // method signature
  params = token.collect(this.conf.PARAM);

  this.signature(params, format.signature, opts.lang);
  this.newline(2);

  this.usage(token.collect(this.conf.USAGE), this.state.lang);

  // method description
  this.describe(type, token);

  if(info.returns) {
    this.output.write(this.format.returns(token, info.returns));
    this.newline(2);
  }

  this.meta(token);

  // @param
  this.parameters(params);
  if(params.length) {
    this.newline();
  }

  // @option
  options = token.collect(this.conf.OPTION);
  if(options.length) {
    this.heading(this.conf.title.OPTIONS, level + 1);
    this.parameters(options);
    this.newline();
  }

  // @throws
  throwables = token.collect(this.conf.THROWS);
  if(throwables.length) {
    this.heading(this.conf.title.THROWS, level + 1);
    this.parameters(throwables);
    this.newline();
  }

  // @event
  events = token.collect(this.conf.EVENT);
  if(events.length) {
    this.heading(this.conf.title.EVENTS, level + 1);
    this.parameters(events);
    this.newline();
  }

  this.see(token, state.depth);
  cb();
}

/**
 *  Render a property block.
 *
 *  @function _property
 *  @param {Object} type The tag that initiated the render.
 *  @param {Object} token The current comment AST token.
 *  @param {Function} cb Callback function.
 */
function _property(type, token, cb) {
  var opts = this.opts
    , state = this.state
    , info = token.getInfo(false);

  this.heading(type.name, state.depth);

  this.fenced(
    this.format.property(type, info), opts.lang)
  this.newline(2);

  this.usage(token.collect(this.conf.USAGE), this.state.lang);

  this.describe(type, token);
  this.meta(token);
  this.see(token, state.depth);
  cb();
}

module.exports = {
  _class: _class,
  _function: _function,
  _property: _property
}
