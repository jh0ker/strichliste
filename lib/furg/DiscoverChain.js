function DiscoverChain() {

}

//cc.isInvalidating() === true
DiscoverChain.prototype.discoverDependents = function(cacheConnection, keys) {

};

//cc.isInvalidating() === false
DiscoverChain.prototype.discoverDependencies = function(cacheConnection, keys) {
    keys = keys || {};

    var dependencies = cacheConnection.getDependencies();
    var result = [];

    if (Array.isArray(dependencies[0])) {
        //[pool.User.all, pool.Transaction.all] => dependent from user AND Transaction
        dependencies[0].forEach(function(quantifiedResource) {
            result.push(quantifiedResource.toString(keys));
        });
    } else {
        var parts = [];
        dependencies.forEach(function(quantifiedResource) {
            parts.push(quantifiedResource.toString(keys));
        });
        result.push(parts.join('|'));
    }

    return result;
};

module.exports = DiscoverChain;