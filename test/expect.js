// rebuild the expectations, used when formatting 
// styles have changed
var parse = require('../index')
  , fs = require('fs')
  , expectations =       
    [
      {
        files: ['test/fixtures/usage.js'],
        output: 'test/fixtures/expect/usage-ast.json',
        opts: {
          ast: true
        }
      },
      {
        files: ['test/fixtures/usage.js'],
        output: 'test/fixtures/expect/usage-ast-compact.json',
        opts: {
          ast: true,
          indent: 0
        }
      },
      {
        files: ['test/fixtures/description.js'],
        output: 'test/fixtures/expect/description.md'
      },
      {
        files: ['test/fixtures/usage.js'],
        output: 'test/fixtures/expect/usage.md'
      },
      {
        files: ['test/fixtures/usage.js'],
        output: 'test/fixtures/expect/usage-no-lang.md',
        opts: {
          lang: false
        }
      },
      {
        files: ['test/fixtures/params.js'],
        output: 'test/fixtures/expect/params.md'
      },
      {
        files: ['test/fixtures/param-types.js'],
        output: 'test/fixtures/expect/param-types.md'
      },
      {
        files: ['test/fixtures/options.js'],
        output: 'test/fixtures/expect/options.md'
      },
      {
        files: ['test/fixtures/options.js'],
        output: 'test/fixtures/expect/options.md'
      },
      {
        files: ['test/fixtures/optional.js'],
        output: 'test/fixtures/expect/optional.md'
      },
      {
        files: ['test/fixtures/usage.js', 'test/fixtures/method.js'],
        output: 'test/fixtures/expect/multiple.md'
      },
      {
        files: ['test/fixtures/usage.js'],
        output: 'test/fixtures/expect/usage-no-heading.md',
        opts: {
          heading: false
        }
      }
    ];

/**
 *  Iterate the expectation configuration and write results to disc.
 *
 *  @function expected
 */
function expected() {
  var info = expectations.shift();
  if(!info) {
    return; 
  }
  info.opts = info.opts || {};
  info.opts.stream = fs.createWriteStream(info.output);
  parse(info.files, info.opts, function(err) {
    if(err) {
      console.error(err.stack); 
      process.exit(1);
    }
    expected();
  })
}

expected();
