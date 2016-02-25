var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mdapi:', function() {

  it('should print usage without lang', function(done) {
    var output = 'target/usage-no-lang.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/usage-no-lang.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/usage.js'],
      {stream: fs.createWriteStream(output), lang: false},
      complete);
  });

});
