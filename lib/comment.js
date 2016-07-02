/**
 *  Encapsulates operations on a comment AST token.
 *
 *  This implementation uses a cache map to look up tags in the 
 *  underlying list of tags.
 *
 *  @class Comment
 *
 *  @param {Object} token the comment AST token to wrap.
 *  @param {Function} scope the execution scope.
 */
function Comment(token, scope) {

  // inherit properties from AST
  for(var k in token) {
    this[k] = token[k];
  }
  // tag cache
  this._cache = null;

  this.scope = scope;
  this.conf = scope.conf;
}

/**
 *  Returns a description for a comment.
 *
 *  @member{function} describe 
 *  @param {Object} type a related type tag.
 *  @param {Boolean} concat whether to concatenate the name and description.
 *
 *  @returns {String} a description or the empty string.
 */
function describe(type, concat) {
  var str = '';
  // always prefer comment block description
  if(this.description && concat === undefined) {
    str = this.description; 
  }else{
    if(!concat) {
      str = type.description || ''; 
    }else{
      // for example: @returns
      str = type.name + ' ' + type.description;
    }
  }
  return str;
}

/**
 *  Builds a cache map of tags.
 *
 *  @private {function} cache
 *  @member
 */
function cache() {
  var i
    , tag
    , id;
  if(!this._cache) {
    this._cache = {};
    // prevent conflict on constructor keyword
    this._cache.constructor = null;
    for(i = 0;i < this.tags.length;i++) {
      tag = this.tags[i];
      id = tag.id;
      if(!this._cache[id]) {
        this._cache[id] = tag;
      }else if(Array.isArray(this._cache[id])) {
        this._cache[id].push(tag);
      }else{
        this._cache[id] = [this._cache[id], tag];
      }
    }
  }
  return this._cache;
}

/**
 *  Get the details name, type tag and id for this comment.
 *
 *  @member {function} getDetail
 *  @param {Array} [names] List of custom tag names.
 *
 *  @returns {Object} an object with `name`, `type` and `id`.
 */
function getDetail(names) {
  var name = this.find(this.conf.NAME)
    , func = this.find(this.conf.FUNCTION)
        || this.find(this.conf.CLASS)
        || this.find(this.conf.CONSTRUCTOR)
    , prop = this.find(this.conf.PROPERTY)
    , mod = this.find(this.conf.MODULE)
    //, usage = this.find(this.conf.USAGE)
    , type
    , i
    , tag
    , shorthands = this.conf.shorthand;

  type = mod || func || prop;

  if(!type) {
    // allows `@name {function} FunctionName`
    for(i = 0;i < shorthands.length;i++) {
      tag = this.find(this.conf[shorthands[i].toUpperCase()]);
      if(tag && tag.type) {
        type = {id: tag.type, name: tag.name};
      } 
    }
  }

  // inject name into type declaration
  // `@name FunctionName\n@function`
  if(name && type && !type.name) {
    type.name = name.name; 
  }

  // test for custom tag renderer
  if(!type && names) {
    for(i = 0;i < names.length;i++) {
      if(this.find(names[i])) {
        type = this.find(names[i]);
        break;
      }
    }
  }

  // `@function FunctionName`
  if(!name && type && type.name) {
    name = {name: type.name}; 
  }

  // TODO: handle no type tag properly

  return {name: name, type: type, id: type ? type.id : null};
}

/**
 *  Gets an info object containing generic tag lookups.
 *
 *  If the `method` parameter is given the object is decorated with 
 *  fields specific to the `function` type.
 *
 *  @member {function} getInfo
 *  @param {Boolean} method Inject function specific information.
 *
 *  @return an object with tag references.
 */
function getInfo(method) {
  var info = {
    // generic flags
    isModule: this.find(this.conf.MODULE),
    isClass: this.find(this.conf.CLASS),
    isStatic: this.find(this.conf.STATIC),
    isConstant: this.find(this.conf.CONSTANT),
    isPrivate: this.find(this.conf.PRIVATE),
    isPublic: this.find(this.conf.PUBLIC),
    isProtected: this.find(this.conf.PROTECTED),
    isReadOnly: this.find(this.conf.READONLY),
    isMember: this.find(this.conf.MEMBER)
  };

  info.inherits =  this.find(this.conf.INHERITS);

  // method specific tags
  if(method === true) {
    info.isConstructor =  this.find(this.conf.CONSTRUCTOR);
    info.returns =  this.find(this.conf.RETURNS);
  // property specific tags
  }else if(method === false) {
    info.value = this.find(this.conf.DEFAULT);
  }
  return info;
}

/**
 *  Finds the last tag in the tag list by tag id.
 *
 *  @member {function} find
 *  @param {String} id The tag identifier.
 *
 *  @returns a tag or `undefined` if not found.
 */
function find(id) {
  var map = this.cache();
  if(map[id]) {
    return !Array.isArray(map[id]) ? map[id] : map[id][map[id].length - 1];
  }
}

/** 
 *  Collects all tags with the specified id.
 *
 *  @member {function} collect
 *  @param {String} id The tag identifier.
 *
 *  @returns an array of tags.
 */
function collect(id) {
  var map = this.cache();
  if(map[id]) {
    return Array.isArray(map[id]) ? map[id] : [map[id]];
  }
  return [];
}

Comment.prototype.cache = cache;

Comment.prototype.describe = describe;
Comment.prototype.getDetail = getDetail;
Comment.prototype.getInfo = getInfo;
Comment.prototype.find = find;
Comment.prototype.collect = collect;

module.exports = Comment;
