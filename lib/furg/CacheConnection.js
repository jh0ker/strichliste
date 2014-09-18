//TODO: add deletes

function CacheConnection () {
    this._depends = [];
    this._adds = null;
    this._changes = null;
}

CacheConnection.prototype.depends = function () {
    if (Array.isArray(arguments[0])) {
        this._depends.push(this._sanitize(arguments[0]));
    } else {
        for (var i = 0; i < arguments.length; i++) {
            this._depends.push(this._sanitize(arguments[i]));
        }
    }

    return this;
};

CacheConnection.prototype.adds = function (entity) {
    this._adds = this._sanitize(entity);

    return this;
};

CacheConnection.prototype.changes = function (entity) {
    this._changes = this._sanitize(entity);

    return this;
};

CacheConnection.prototype.getDependencies = function() {
    return this._depends;
};

CacheConnection.prototype.getAdd = function() {
    return this._adds;
};

CacheConnection.prototype.getChange = function() {
    return this._changes;
};

CacheConnection.prototype.isInvalidating = function () {
    return this._adds.length !== null || this._changes.length !== null;
};

CacheConnection.prototype._sanitize = function (entity) {
    if (Array.isArray(entity)) {
        entity = entity.map(function (element) {
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