function CacheConnection() {
    this._depends = [];
    this._adds = null;
    this._changes = null;
}

CacheConnection.prototype.depends = function() {
    for(var i = 0; i < arguments.length; i++) {
        this._depends.push(this._sanitize(arguments[i]));
    }

    return this;
};

CacheConnection.prototype.adds = function(entity) {
    this._adds = this._sanitize(entity);

    return this;
};

CacheConnection.prototype.changes = function(entity) {
    this._changes = this._sanitize(entity);

    return this;
};

CacheConnection.prototype._sanitize = function(entity) {

    if (Array.isArray(entity)) {
        entity = entity.map(function(element) {
            if (!element.resource) throw new Error('not a resource');

            return element.resource;
        });
    } else {
        if (!entity.resource) throw new Error('not a resource');

        entity = entity.resource;
    }

    return entity;
};

module.exports = CacheConnection;