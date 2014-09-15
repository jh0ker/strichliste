function Pool () {
    this._entities = {};
}

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

            Object.defineProperty(creator, 'all', {
                get: function () {
                    resource.identifier = 'all';

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