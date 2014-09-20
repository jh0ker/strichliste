var expect = require('chai').use(require('sinon-chai')).expect;
var sinon = require('sinon');

var Resource = require('../../lib/furg/Resource');
var ResourceQuantifier = require('../../lib/furg/ResourceQuantifier');
var Pool = require('../../lib/furg/Pool');

describe.skip('furg', function () {
    describe('Pool', function() {
        var pool, a;

        before(function() {
            pool = new Pool();

            a = new Resource('A');
            pool.register(a);
        });

        it('should return a quantified Resource /wo quantifier', function() {
            var expected = new ResourceQuantifier(a);

            expect(pool.A.resource).to.be.deep.equal(expected);
        });

        it('should return a quantified Resource /w all quantifier', function() {
            var expected = new ResourceQuantifier(a);
            expected.setQuantifier('all');

            expect(pool.A.all.resource).to.be.deep.equal(expected);
        });

        it('should return a quantified Resource /w foo quantifier', function() {
            var expected = new ResourceQuantifier(a);
            expected.setQuantifier('foo');

            expect(pool.A('foo').resource).to.be.deep.equal(expected);
        });
    });
});