var assert = require('chai').assert
var should = require('chai').should()
var otx = require('../build')

var API_KEY = process.env.API_KEY



describe('getAll()', function() {

    context('when API Key not present', function() {
        it('should throw an error', function() {
            otx.getAll.bind(this).should.throw('No apikey has been passed.')

            otx.getAll.bind(this, {
                modified_since: '2016-03-18T16:07:29',
                limit: 10
            }).should.throw('No apikey has been passed.')
        });
    });

    context('when API Key is present', function() {

        it('should not throw an error', function(done) {
            otx.getAll.bind(this, {
                apikey: API_KEY,
                modified_since: '2016-03-18T16:07:29',
                limit: 10
            }).should.not.throw(done)
        });

        it('should retrive data', function(done) {
            var stream = otx.getAll({
                apikey: API_KEY,
                modified_since: '2016-03-18T16:07:29',
                limit: 1
            })

            stream.on('data', function(data) {
                done()
            })
        });
    });

});
