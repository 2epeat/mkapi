var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index').parse;

describe('mkapi:', function() {

  it('should print method parameters', function(done) {
    var output = 'target/usage.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/params.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/params.js'],
      {output: fs.createWriteStream(output)},
      complete);
  });

});
