function Entity (name) {
    this._name = name;
    this._has = [];
    this._parent = null;
}

Entity.prototype.name = function () {
    return this._name;
};

Entity.prototype.has = function (entity) {
    this._has.push(entity);
    entity.parent(this);
};

Entity.prototype.parent = function (parent) {
    this._parent = parent;
};

module.exports = Entity;