var expect = require('chai').use(require('sinon-chai')).expect;
var sinon = require('sinon');

var Cache = require('../../lib/furg/Cache');
var CacheConnection = require('../../lib/furg/CacheConnection');
var Pool = require('../../lib/furg/Pool');

var Resource = require('../../lib/furg/Resource');
var DiscoverChain = require('../../lib/furg/DiscoverChain');

describe.skip('furg', function () {
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
        describe('dependents', function() {
            describe('POST /user', function() {
                var cc;
                before(function() {
                    cc = (new CacheConnection()).adds(pool.User);
                });

                it('should return the correct dependencies', function() {
                    expect(discoverChain.discoverDependents(cc))
                        .to.deep.equal(['User:all']);
                });
            });

            describe('POST /user/:userId/transaction', function() {
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