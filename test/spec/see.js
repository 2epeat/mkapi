var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mdapi:', function() {

  it('should print @see', function(done) {
    var output = 'target/see.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/see.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/see.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
