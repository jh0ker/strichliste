var expect = require('chai').use(require('sinon-chai')).expect;
var sinon = require('sinon');

var Cache = require('../../lib/furg/Cache');
var CacheConnection = require('../../lib/furg/CacheConnection');
var Resource = require('../../lib/furg/Resource');
var Pool = require('../../lib/furg/Pool');
var DiscoverChain = require('../../lib/furg/DiscoverChain');

describe('furg', function () {
    describe('cache', function () {
        describe('cache set/get', function () {
            var c;

            before(function () {
                c = new Cache();

                c.set('/a/b', null, 'ab');
                c.set('/a/b', 'foobar', 'foobar');
            });

            it('should hold a value', function () {
                expect(c.get('/a/b', null)).to.equal('ab');
            });

            it('should hold a value /w parameters', function () {
                expect(c.get('/a/b', 'foobar')).to.equal('foobar');
            });
        });

        describe('cache /w clear', function () {
            var c;

            before(function () {
                c = new Cache();

                c.set('/a/b', null, 'ab');
                c.set('/a/b', 'foobar', 'foobar');
                c.set('/a/c', null, 'ac');

                c.clear('/a/b');
            });

            it('should have cleared all items from the same route', function () {
                expect(c.get('/a/b', null)).to.be.null;
                expect(c.get('/a/b', 'foobar')).to.be.null;
            });

            it('should have hold on to the other route', function () {
                expect(c.get('/a/c', null)).to.equal('ac');
            });
        });
    });

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

    describe('discoverChain', function () {
        var pool, discoverChain;

        before(function() {
            pool = new Pool();
            discoverChain = new DiscoverChain();

            var user = new Resource('User');
            var transaction = new Resource('Transaction');

            user.has(transaction);

            pool.register(user);
            pool.register(transaction);
        });

        describe('dependencies', function() {
            describe('GET /user', function() {
                var cc;
                before(function() {
                    cc = (new CacheConnection()).depends(pool.User.all);
                });

                it('should return the correct dependencies', function() {
                    expect(discoverChain.discoverDependencies(cc))
                        .to.deep.equal(['User:all']);
                });
            });

            describe('GET /transaction', function() {
                var cc;
                before(function() {
                    cc = (new CacheConnection()).depends(pool.Transaction.all);
                });

                it('should return the correct dependencies', function() {
                    expect(discoverChain.discoverDependencies(cc))
                        .to.deep.equal(['Transaction:all']);
                });
            });

            describe('GET /user/:userId', function() {
                var cc;
                before(function() {
                    cc = (new CacheConnection()).depends(pool.User('userId'));
                });

                it('should return the correct dependencies', function() {
                    expect(discoverChain.discoverDependencies(cc, {userId: 42}))
                        .to.deep.equal(['User:42']);
                });
            });

            describe('GET /user/:userId/transaction', function() {
                var cc;
                before(function() {
                    cc = (new CacheConnection()).depends(pool.User('userId'), pool.Transaction.all);
                });

                it('should return the correct dependencies', function() {
                    expect(discoverChain.discoverDependencies(cc, {userId: 42}))
                        .to.deep.equal(['User:42|Transaction:all']);
                });
            });

            describe('GET /user/:userId/transaction/:transactionId', function() {
                var cc;
                before(function() {
                    cc = (new CacheConnection())
                        .depends(pool.User('userId'), pool.Transaction('transactionId'));
                });

                it('should return the correct dependencies', function() {
                    expect(discoverChain.discoverDependencies(cc, {userId: 42, transactionId: 23}))
                        .to.deep.equal(['User:42|Transaction:23']);
                });
            });

            describe('GET /metrics', function() {
                var cc;
                before(function() {
                    cc = (new CacheConnection()).depends([pool.User.all, pool.Transaction.all]);
                });

                it('should return the correct dependencies', function() {
                    expect(discoverChain.discoverDependencies(cc))
                        .to.deep.equal(['User:all', 'Transaction:all']);
                });
            });

            describe('GET /transaction', function() {
                var cc;
                before(function() {
                    cc = (new CacheConnection()).depends(pool.Transaction.all);
                });

                it('should return the correct dependencies', function() {
                    expect(discoverChain.discoverDependencies(cc))
                        .to.deep.equal(['Transaction:all']);
                });
            });
        });

        //TODO: delete
        describe.skip('dependents', function() {
            describe('11POST /user', function() {
                var cc;
                before(function() {
                    cc = (new CacheConnection()).adds(pool.User);
                });

                it('should return the correct dependencies', function() {
                    expect(discoverChain.discoverDependents(cc))
                        .to.deep.equal(['User:all']);
                });
            });

            describe('11POST /user/:userId/transaction', function() {
                var cc;
                before(function() {
                    cc = (new CacheConnection())
                        .depends(pool.User('userId'))
                        .adds(pool.Transaction);
                });

                it('should return the correct dependencies', function() {
                    expect(discoverChain.discoverDependents(cc, {userId: 42}))
                        .to.deep.equal(['Transaction:all', 'User:all', 'User:42', 'User:42|Transaction:all']);
                });
            });

            describe('PUT /user/:userId', function() {
                var cc;
                before(function() {
                    cc = (new CacheConnection()).changes(pool.User('userId'));
                });

                it('should return the correct dependencies', function() {
                    expect(discoverChain.discoverDependents(cc, {userId: 42}))
                        .to.deep.equal(['User:all', 'User:42']);
                });
            });

            describe('PUT /user/:userId/transaction/:transactionId', function() {
                var cc;
                before(function() {
                    cc = (new CacheConnection())
                        .depends(pool.User('userId'))
                        .changes(pool.Transaction('transactionId'));
                });

                it('should return the correct dependencies', function() {
                    expect(discoverChain.discoverDependents(cc, {userId: 42, transactionId: 23}))
                        .to.deep.equal(['Transaction:all', 'User:all', 'User:42', 'User:42|Transaction:all', 'User:42|Transaction:23']);
                });
            });
        });
    });
});