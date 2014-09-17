function ResourceQuantifier (resource) {
    this._resource = resource;
    this._quantifier = null;
}

ResourceQuantifier.prototype.resource = function () {
    return this._resource;
};

ResourceQuantifier.prototype.quantifier = function () {
    return this._quantifier;
};

ResourceQuantifier.prototype.setQuantifier = function (quantifier) {
    this._quantifier = quantifier;
};

ResourceQuantifier.prototype.toString = function(keys) {
    var quant = '';

    if (this.quantifier() === 'all') {
        quant = 'all';
    } else if (keys[this.quantifier()]) {
        quant = keys[this.quantifier()];
    }

    return this.resource().name() + ':' + quant;
};

module.exports = ResourceQuantifier;