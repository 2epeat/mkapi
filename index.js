var fs = require('fs')
  , assert = require('assert')
  , comments = require('comment-parser')
  , repeat = require('string-repeater')
  , HEADING = 'API'
  , OPTIONS_HEADING = 'Options'
  , LANG = 'javascript'
  , USAGE ='usage' 
  , PRIVATE ='private' 
  , OPTION = 'option'
  , FUNCTION = 'function'
  , PARAM = 'param';

/**
 *  @usage var parse = require('mdapi');
 *  parse(['index.js'], {stream: process.stdout});
 */

/**
 *  Concatenate input files into a single string.
 *
 *  @private
 *  
 *  @function concat
 *
 *  @param {Array} files List of input files to load.
 *  @param {String} output The output string.
 *  @param {Function} cb Callback function.
 */
function concat(files, output, cb) {
  var file = files.shift();
  output = output || '';
  function onRead(err, contents) {
    if(err) {
      return cb(err); 
    }
    output += contents;
    if(!files.length) {
      return cb(null, output); 
    } 
    concat(files, output, cb);
  }
  fs.readFile(file, onRead);
}

/** 
 *  Print markdown from the parsed AST.
 *
 *  @private
 *
 *  @function print
 *
 *  @param {Object} ast The parsed comments abstract syntax tree.
 *  @param {Object} opts Parse options.
 *  @param {Function} cb Callback function.
 */
function print(ast, opts, cb) {
  var stream = opts.stream
    , level = opts.level
    , called = false
    , json
    , indent = typeof(opts.indent) === 'number' && !isNaN(opts.indent) 
        ? Math.abs(opts.indent) : 2;

  function done(err) {
    /* istanbul ignore if: guard against error race condition */
    if(called) {
      return;
    }
    cb(err || null); 
    called = true;
  }

  stream.once('error', done);

  if(opts.ast) {
    json = JSON.stringify(ast, undefined, indent);

    /* istanbul ignore else: never print to stdout in test env */
    if(stream !== process.stdout) {
      stream.write(json); 
      return stream.end(done);
    }else{
      return stream.write(json);
    }
  }

  // find a tag
  function findTag(name, ast) {
    for(var i = 0;i < ast.tags.length;i++) {
      if(ast.tags[i].tag === name) {
        return ast.tags[i]; 
      }
    }
  }

  // collect tags
  function collect(name, ast) {
    var o = [];
    for(var i = 0;i < ast.tags.length;i++) {
      if(ast.tags[i].tag === name) {
        o.push(ast.tags[i]);
      }
    }
    return o;
  }


  // print a heading
  function heading(str, level) {
    stream.write(repeat('#', level) + ' ' + str); 
  }

  // print newline(s)
  function newline(num) {
    num = num || 1; 
    stream.write(repeat('\n', num)); 
  }

  // print a fenced code block
  function fenced(code, lang) {
    stream.write('```'); 
    if(typeof lang === 'string') {
      stream.write(lang); 
    }
    newline();
    stream.write(code);
    newline();
    stream.write('```'); 
  }

  // print the function signature
  function signature(name, token) {
    var sig = '('
      , params = collect(PARAM, token);
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

    fenced(name + sig, opts.lang);
    return params;
  }

  // initial heading
  if(opts.heading && typeof opts.heading === 'string') {
    heading(opts.heading, level); 
    newline(2);
    level++;
  }

  // print a list of parameters
  function parameters(params) {
    params.forEach(function(param) {
      var name = param.name
        , type = '';

      if(param.type) {
        type = param.type + ' '; 
      }
      stream.write('* `' + name + '` ' + type + param.description);
      newline();
    })
  }

  // walk the ast
  ast.forEach(function(token) {
    var tag = findTag(FUNCTION, token)
      , exclude = findTag(PRIVATE, token)
      , name
      , usage = findTag(USAGE, token)
      , params
      , options;

    if(usage) {
      fenced(usage.name + ' ' + usage.description, opts.lang);
      newline(2);
    }

    if(exclude || (!tag || !tag.name)) {
      return; 
    }

    name = tag.name;
    
    // method heading
    heading(name, level);
    newline(2);

    // method signature
    params = signature(name, token);
    newline(2);

    // method description
    if(token.description) {
      stream.write(token.description);
      newline(2);
    }

    // parameter list
    parameters(params);
    if(params.length) {
      newline();
    }

    // options list
    options = collect(OPTION, token);
    if(options.length) {
      heading(OPTIONS_HEADING, level + 1);
      newline(2);
      parameters(options);
      newline();
    }
  })

  stream.once('finish', done);

  /* istanbul ignore else: never write to stdout in tests */
  if(stream !== process.stdout) {
    stream.end(); 
  }else{
    done();
  }
}

// jscs:disable maximumLineLength
/**
 *  Accepts an array of files, concatenates the files in the order given 
 *  into a string, parse the comments in the resulting string into an AST 
 *  and transform the AST into commonmark compliant markdown.
 *
 *  The callback function is passed an error and also the AST on success: 
 *  `function(err, ast)`.
 *
 *  @function parse
 *
 *  @param {Array} files List of files to parse.
 *  @param {Object} [opts] Parse options.
 *  @param {Function} cb Callback function.
 *
 *  @option {Writable} stream The stream to write to, default is `stdout`.
 *  @option {Number} level Initial level for the first heading, default is `1`.
 *  @option {String} heading Value for the initial heading, default is `API`.
 *  @option {String} lang Language for fenced code blocks, default is `javascript`.
 */
function parse(files, opts, cb) {
  assert(Array.isArray(files), 'array of files expected');

  if(typeof opts === 'function') {
    cb = opts; 
    opts = null;
  }

  assert(cb instanceof Function, 'callback function expected');

  opts = opts || {};

  // stream to print to
  opts.stream = opts.stream !== undefined ? opts.stream : process.stdout;

  // starting level for headings
  opts.level = opts.level || 1;

  // value for the initial heading
  opts.heading = opts.heading !== undefined ? opts.heading : parse.HEADING;

  // language for fenced code blocks
  opts.lang = opts.lang !== undefined ? opts.lang : parse.LANG;

  concat(files.slice(), null, function onLoad(err, result) {
    if(err) {
      return cb(err); 
    }

    var ast = comments(result, {trim: true});

    function onPrint(err) {
      if(err) {
        return cb(err);
      }
      cb(null, ast);
    }

    print(ast, opts, onPrint);
  })
}

/**
 *  Default heading value.
 *
 *  @field {String} HEADING
 *
 *  @default API
 */
parse.HEADING = HEADING;

/**
 *  Default language for fenced code blocks.
 *
 *  @field {String} LANG
 *
 *  @default javascript
 */
parse.LANG = LANG;

module.exports = parse;
