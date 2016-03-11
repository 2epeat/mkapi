var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mkapi:', function() {

  it('should print @module', function(done) {
    var output = 'target/module.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/module.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/module.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
