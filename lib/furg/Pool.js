var ResourceQuantifier = require('./ResourceQuantifier');

function Pool () {
    this._resources = {};
}

Pool.KEY_ALL = 'all';

Pool.prototype.register = function (resource) {
    this._resources[resource.name()] = resource.name();

    var resourceName = resource.name();

    Object.defineProperty(this, resourceName, {
        get: function () {
            var quantifiedResource = new ResourceQuantifier(resource);

            var creator = function (marker) {
                quantifiedResource.setQuantifier(marker);

                return { resource: quantifiedResource };
            };

            creator.resource = quantifiedResource;

            Object.defineProperty(creator, Pool.KEY_ALL, {
                get: function () {
                    quantifiedResource.setQuantifier(Pool.KEY_ALL);

                    return { resource: quantifiedResource };
                }
            });

            return creator;
        }
    });
};

module.exports = Pool;