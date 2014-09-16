function Pool () {
    this._entities = {};
}

Pool.KEY_ALL = 'all';

Pool.prototype.register = function (entity) {
    this._entities[entity.name()] = entity.name();

    var entityName = entity.name();

    Object.defineProperty(this, entityName, {
        get: function () {
            var resource = {
                name: entityName,
                identifier: null
            };

            var creator = function (marker) {
                resource.identifier = marker;

                return {
                    resource: resource
                }
            };

            creator.resource = resource;

            Object.defineProperty(creator, Pool.KEY_ALL, {
                get: function () {
                    resource.identifier = Pool.KEY_ALL;

                    return {
                        resource: resource
                    }
                }
            });

            return creator;
        }
    });
};

module.exports = Pool;