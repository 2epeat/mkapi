var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mdapi:', function() {

  it('should print @class', function(done) {
    var output = 'target/class.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/class.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/class.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
