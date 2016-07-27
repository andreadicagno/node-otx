var assert = require('chai').assert;
var expect = require('chai').expect
var otx = require('../build');

describe('getAll()', function() {

    context('when API Key not present', function() {
        it('should throw an error', function() {
            expect(otx.getAll.bind({
                modified_since: '2016-03-18T16:07:29',
                limit: 10
            })).to.throw('No apikey has been passed.');
        });
    });

});
