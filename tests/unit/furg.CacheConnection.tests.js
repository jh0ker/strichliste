var expect = require('chai').use(require('sinon-chai')).expect;
var sinon = require('sinon');

var Cache = require('../../lib/furg/Cache');
var CacheConnection = require('../../lib/furg/CacheConnection');
var Pool = require('../../lib/furg/Pool');

describe.skip('furg', function () {
    describe('cacheConnection', function () {
        describe('faulty assignments', function () {
            var a = new CacheConnection();

            it('should throw on invalid dependency', function () {
                expect(function () {
                    a.depends([1, 2, 3]);
                }).to.throw('not a resource');
            });

            it('should throw on invalid dependency', function () {
                expect(function () {
                    a.depends(true);
                }).to.throw('not a resource');
            });

            it('should throw on invalid add', function () {
                expect(function () {
                    a.adds(true);
                }).to.throw('not a resource');
            });

            it('should throw on invalid change', function () {
                expect(function () {
                    a.changes(true);
                }).to.throw('not a resource');
            });
        });

        describe('assignments', function () {
            var a;
            before(function () {
                a = new CacheConnection();
                a.depends({resource: 1}, {resource: 2}, {resource: 3});
                a.adds({resource: 2});
                a.changes({resource: 3});
            });

            it('should add multiple dependencies', function () {
                expect(a.getDependencies()).to.deep.equal([1, 2, 3]);
            });

            it('should add', function () {
                expect(a.getAdd()).to.equal(2);
            });

            it('should change', function () {
                expect(a.getChange()).to.deep.equal(3);
            });

            it('should signal that it is invalidating', function () {
                expect(a.isInvalidating()).to.be.true;
            });
        });

        describe('parallel assignment', function () {
            var a;
            before(function () {
                a = new CacheConnection();
                a.depends([{resource: 1}, {resource: 2}], {resource: 'ishouldnotbeeseen'});
            });

            it('should only add the parralel assignment', function () {
                expect(a.getDependencies()).to.deep.equal([[1, 2]]);
            });
        });
    });
});