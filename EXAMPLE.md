# Markdown API Example

## Input

File from the [test fixture](https://github.com/mkdoc/mkapi/blob/master/test/spec/full.js):

```javascript
/**
 *  var create = require('component');
 *  var component = create();
 *
 *  @usage
 */

/**
 *  A mock program module, using the @module tag sets the overall 
 *  title at the initial level setting.
 *
 *  @module API Documents
 *
 *  @author muji
 *  @version 1.1.0
 *  @since 1.0
 *  @license MIT
 *
 *  @see https://github.com/mkdoc/mkapi mkapi
 *  @see https://github.com/jgm/commonmark.js commonmark
 */

/**
 *  Mock class, you can add an extended description of the class behaviour here.
 *
 *  @class Component
 */

/**
 *  An abstract component.
 *
 *  @constructor Component
 *  @inherits EventEmitter Object
 *
 *  @author muji
 *  @version 1.1.0
 *  @since 1.0
 *
 *  @param opts Component options.
 *
 *  @option enabled Whether the component is initially enabled.
 */

/** 
 *  Do foo thing with bar.
 *
 *  @function foo
 *  @member
 *
 *  @author muji
 *  @version 1.1.0
 *  @since 1.0
 *
 *  @param {Object} [opts] An options arguments.
 *  @param {Function} cb Callback function.
 *
 *  @option {Boolean} noop Dry run.
 *
 *  @throws Error JSON parse error.
 *  @throws Error File create error.
 */

/**
 *  A static function declaration.
 *
 *  @deprecated use create instead.
 *  
 *  @static factory
 *
 *  @returns a new component.
 */

/**
 *  Create a new component.
 *
 *  @function create
 */

/**
 *  Sets the BAZ variable.
 *
 *  @property BAZ
 *  @default baz
 *
 *  @author muji
 *  @version 1.1.0
 *  @since 1.0
 *
 */

/**
 *  Sets the QUX variable.
 *
 *  @property QUX
 */

/**
 *  Gets the ZAR variable.
 *
 *  @constant ZAR
 *  @default foo
 */
```

## Result

Rendered output with `--level=2`:

### API

A mock program module, using the @module tag sets the overall
title at the initial level setting.

* **author** `muji`
* **version** `1.1.0`
* **since** `1.0`
* **license** `MIT`
* [mkapi](https://github.com/mkdoc/mkapi)
* [commonmark](https://github.com/jgm/commonmark.js)

#### Component

Mock class, you can add an extended description of the class behaviour here.

##### Component < EventEmitter < Object

```javascript
new Component(opts)
```

An abstract component.

* **author** `muji`
* **version** `1.1.0`
* **since** `1.0`
* `opts` Component options.

###### Options

* `enabled` Whether the component is initially enabled.

##### .foo

```javascript
Component.prototype.foo([opts], cb)
```

Do foo thing with bar.

* **author** `muji`
* **version** `1.1.0`
* **since** `1.0`
* `opts` Object An options arguments.
* `cb` Function Callback function.

###### Options

* `noop` Boolean Dry run.

###### Throws

* `Error` JSON parse error.
* `Error` File create error.

##### create

```javascript
create()
```

Create a new component.

##### BAZ

```javascript
BAZ = baz;
```

Sets the BAZ variable.

* **author** `muji`
* **version** `1.1.0`
* **since** `1.0`

##### QUX

```javascript
QUX
```

Sets the QUX variable.

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on February 8, 2017

