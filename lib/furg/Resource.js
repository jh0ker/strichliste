function Resource (name) {
    this._name = name;
    this._has = [];
    this._parent = null;
}

Resource.prototype.name = function () {
    return this._name;
};

Resource.prototype.has = function (entity) {
    this._has.push(entity);

    entity.parent(this);
};

Resource.prototype.parent = function (parent) {
    this._parent = parent;
};

Resource.prototype.getChildren = function() {
    return this._has;
};

Resource.prototype.getParent = function() {
    return this._parent;
};

module.exports = Resource;