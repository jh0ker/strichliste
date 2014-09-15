var Pool = require('./lib/furg/Pool');
var Entity = require('./lib/furg/Entity');
var CacheConnection = require('./lib/furg/CacheConnection');



var pool = new Pool();

var user = new Entity('User');
var transaction = new Entity('Transaction');

user.has(transaction);

pool.register(new Entity('User'));
pool.register(new Entity('Transaction'));

// GET  /user
var a = (new CacheConnection()).depends(pool.User.all);
console.log( a );

// POST /user
var b = (new CacheConnection()).adds(pool.User);
console.log( b );

// GET /transaction
var c = (new CacheConnection())
    .depends(pool.Transaction.all);
console.log( c );

//GET /user/:userId
var d = (new CacheConnection())
    .depends(pool.User(':userId'));
console.log( d );

// GET /user/:userId/transaction
var e = (new CacheConnection())
    .depends(pool.User(':userId'), pool.Transaction.all);
console.log( e );

// POST /user/:userId/transaction
var f = (new CacheConnection())
    .depends(pool.User(':userId'))
    .adds(pool.Transaction);
console.log( f );

// GET  /user/:userId/transaction/:transactionId
var g = (new CacheConnection())
    .depends(pool.User(':userId'), pool.Transaction('transactionId'));
console.log( g );

// GET /metrics
var h = (new CacheConnection())
    .depends([pool.User.all, pool.Transaction.all]);
console.log( h );

// GET  /transaction
var i = (new CacheConnection())
    .depends(pool.Transaction.all);
console.log( i );