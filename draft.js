/*
    GET  /user
        R: allUsers
    POST /user
        adds user                                                   -> invalidate allUsers
    GET  /transaction
        R: allTransactions
    GET  /user/:userId
        R: user[:userId]
    GET  /user/:userId/transaction
        R: allTransactions of user[:userId]
    POST /user/:userId/transaction
        adds transaction to user[:userId]                           -> invalidate user[:userId] -> invalidate allUsers ->invalidate allTransactions
    GET  /user/:userId/transaction/:transactionId
        loads transaction[:transactionId] of user[:userId]
    GET  /metrics
        loads allTransactions and allUsers
    GET  /transaction
        loads allTransactions
*/

var furg = require('furg');

var pool = new furg.EntityPool();
var user = new furg.Entity('User');
var transaction = new furg.Entity('Transaction');

user.has(transaction);

pool.register(user);
pool.register(transaction);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var cc = furg.CacheConnection();

// GET  /user
cc.depends(pool.User.all);

// POST /user
cc.adds(pool.User);

// GET /transaction
cc.depends(pool.Transaction.all);

//GET /user/:userId
cc.depends(pool.User(':userId'));

// GET /user/:userId/transaction
cc.depends(pool.User(':userId'), pool.Transaction.all);

// POST /user/:userId/transaction
cc.adds(pool.User(':userId'), pool.Transaction);

// GET  /user/:userId/transaction/:transactionId
cc.depends(pool.User(':userId'), pool.Transaction('transactionId'));

// GET /metrics
cc.depends([pool.User.all, pool.Transaction.all]);

// GET  /transaction
cc.depends(pool.Transaction.all);