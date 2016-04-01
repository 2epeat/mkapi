var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index').parse;

describe('mkapi:', function() {

  it('should print method parameters w/ types', function(done) {
    var output = 'target/usage.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/param-types.md');

    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/param-types.js'],
      {output: fs.createWriteStream(output)},
      complete);
  });

});
