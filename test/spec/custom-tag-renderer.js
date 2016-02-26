var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mdapi:', function() {

  it('should use custom tag and renderer', function(done) {
    var output = 'target/custom-tag-renderer.md'
      , tag = 'custom'
      , def
      , registry;

    function renderer(type, token, cb) {
      expect(type.tag).to.eql(tag);
      expect(type.name).to.eql('Name');
      expect(type.type).to.eql('Type');
      expect(type.description).to.eql('Description');
      expect(token.description).to.eql('Custom tag description.');
      cb(); 
    }

    def = parse.tag(tag);
    registry = parse.register(tag, renderer);

    expect(def).to.be.an('object');
    expect(def.name).to.eql(tag);
    expect(def.synonyms).to.be.an('array');
    expect(registry).to.be.an('object');

    function complete(err) {
      if(err) {
        return done(err); 
      }
      //var contents = '' + fs.readFileSync(output);
      //expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/custom-tag-renderer.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
