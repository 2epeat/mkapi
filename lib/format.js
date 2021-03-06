/**
 *  Provides string format functions.
 *
 *  @module formats
 */
var repeat = require('string-repeater')
  , EOL = require('os').EOL;

/**
 *  Gets a heading string.
 *
 *  @function heading
 *  @param {String} val The value for the heading.
 *  @param {Number} level The level for the heading.
 *
 *  @returns {String} the heading.
 */
function heading(val, level) {
  return repeat('#', level) + ' ' + val;
}

/**
 *  Gets a list item for the meta data.
 *
 *  @function meta
 *  @param {Object} val The value for the heading.
 *  @param {String} title A prefix for the meta item.
 *
 *  @returns {String} a list item for the meta data.
 */
function meta(tag, title) {
  return '* **' + title + '** `' + tag.name + '`'
}

/**
 *  Gets a fenced code block.
 *
 *  @function fenced
 *  @param {String} code The content for the code block.
 *  @param {String} info A language info string.
 *
 *  @returns {String} a fenced code block.
 */
function fenced(code, info) {
  var str = '```';
  if(typeof info === 'string') {
    str += info;
  }
  str += EOL + code + EOL;
  str += '```';
  return str;
}

/**
 *  Gets a deprecated notice.
 *
 *  @function deprecated
 *  @param {Object} tag The deprecated tag.
 *
 *  @returns {String} a deprecation notice.
 */
function deprecated(tag) {
  return '> **' + this.conf.title.DEPRECATED + ':** '
    + tag.name + ' ' + tag.description;
}

/**
 *  Gets a function signature.
 *
 *  @function signature
 *  @param {Array} params Collection of param tags.
 *
 *  @returns {String} a function signature.
 */
function signature(params) {
  var sig = '('
  params.forEach(function(param, index) {
    if(param.optional) {
      sig += '[';
    }
    if(index) {
      sig += ', ';
    }
    sig += param.name;
    if(param.optional) {
      sig += ']';
    }
  })
  sig += ')';
  return sig;
}

/**
 *  Gets a list item for parameter listings.
 *
 *  @function parameter
 *  @param {Object} tag The param tag.
 *
 *  @returns a parameter list item.
 */
function parameter(tag) {
  var name = tag.name
    , type = '';

  if(tag.type) {
    type = tag.type
    if(tag.value) {
      type += '=' + tag.value;
    }
    type += ' ';
  }
  return '* `' + name + '` ' + type + tag.description;
}

/**
 *  Gets a returns statement.
 *
 *  @function returns
 *  @param {Object} token the current AST token.
 *  @param {Object} tag The returns tag.
 *
 *  @returns {String} the returns value.
 */
function returns(token, tag) {
  return this.conf.title.RETURNS + ' ' + token.describe(tag, true);
}

/**
 *  Gets a link from a tag.
 *
 *  @function link
 *  @param {Object} tag The see tag.
 *
 *  @returns formatted string.
 */
function link(tag) {
  var url = tag.name;
  var text = tag.description || tag.name;
  var title = tag.description;
  var protocol = /^\w+:\/\//;

  if(protocol.test(text)) {
    text = text.replace(protocol, '')
  }

  var ln = '* [' + (text) + ']'
    + '(' + url;

  if(title) {
    ln += ' "' + title + '"'
  }

  ln += ')';

  return ln;
}

/**
 *  Gets the access modifier for a symbol.
 *
 *  @function getAccess
 *  @param {Object} opts Format options describing the symbol.
 *
 *  @returns {String} the access for the symbol.
 */
function getAccess(opts) {
  var prop = opts.isPublic || opts.isProtected || opts.isPrivate
    , parts = [];

  if(prop) {
    parts.push(prop.id);
  }

  if(opts.isStatic) {
    parts.push(opts.isStatic.id);
  }

  if(opts.isReadOnly) {
    parts.push(opts.isReadOnly.id);
  }

  return parts.join(' ') + (parts.length ? ' ' : '');
}

/**
 *  Gets a property code string.
 *
 *  @function property
 *  @param {String} tag The declaring tag.
 *  @param {Object} opts Format options describing the property.
 *
 *  @returns formatted string.
 */
function property(tag, opts) {
  var str = tag.name
    , value = opts.value
    , flag = getAccess(opts);

  // type identifier when available
  if(tag.type) {
    str = tag.type + ' ' + str;
  }

  // set a default value
  if(value) {
    str += ' = ' + value.name + ';'
  }

  if(opts.isConstant) {
    str = 'const ' + (value || str);
  }

  if(flag) {
    str = flag + str;
  }

  return str;
}

/**
 *  Gets the inheritance string for a class or constructor.
 *
 *  @function inherits
 *  @param {Object} tag The declaring tag.
 *  @param {Object} opts Format options describing the function.
 */
function inherits(tag, opts) {
  var title = tag.name;
  // method inheritance
  title += this.conf.cues.CONSTRUCTOR + opts.inherits.name;
  // multiple levels of inheritance
  if(opts.inherits.description) {
    title += this.conf.cues.CONSTRUCTOR
      + opts.inherits.description.split(/\s+/)
          .join(this.conf.cues.CONSTRUCTOR);
  }
  return title;
}


/**
 *  Gets the heading title for a function.
 *
 *  @function method
 *  @param {Object} tag The declaring tag.
 *  @param {Object} opts Format options describing the function.
 *  @param {String} [title] An existing title for the function.
 *
 *  @todo remove magic strings.
 */
function method(tag, opts, title) {
  var sig = tag.name
    , flag = getAccess(opts);

  title = title || tag.name

  // visual cues on the heading title
  if (this.conf.cues) {
    if(opts.isStatic) {
      title = this.conf.cues.STATIC + tag.name;
    }else if(opts.isMember) {
      title = this.conf.cues.MEMBER + tag.name;
    }
  } else {
    title += '()'
  }

  // code signature
  if(opts.isConstructor) {
    sig = 'new ' + tag.name;
  }else if(opts.isMember && opts.isMember.name) {
    if (!opts.isStatic && this.conf.cues !== false) {
      sig = opts.isMember.name + '.prototype.' + tag.name;
    }else{
      //sig = opts.isMember.name + '.' + tag.name;
      sig = tag.name;
    }
  }

  if(flag && !opts.isConstructor) {
    sig = flag + sig;
  }

  return {title: title, signature: sig};
}

/**
 *  Gets the todo list.
 *
 *  @function getTodo
 *  @param {Object} tag The declaring tag.
 *
 *  @returns {String} The list of todo items.
 *
 *  @todo remove magic strings.
 */
function getTodo(items) {
  var str = ''
    , i
    , item;

  for(i = 0;i < items.length;i++) {
    item = items[i];
    str += '* `' + (item.type || 'TODO')
      + '` ' + item.name + ' ' + item.description + EOL;
  }
  return str;
}

module.exports = {
  heading: heading,
  fenced: fenced,
  meta: meta,
  signature: signature,
  property: property,
  method: method,
  parameter: parameter,
  returns: returns,
  link: link,
  inherits: inherits,
  deprecated: deprecated,

  getAccess: getAccess,
  getTodo: getTodo
}
