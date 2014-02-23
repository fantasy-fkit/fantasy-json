var daggy = require('daggy'),
    helpers = require('fantasy-helpers'),
    Either = require('fantasy-eithers'),
    PartialLens = require('fantasy-lenses'),

    Json = daggy.tagged('x');

// Methods
Json.of = function(x) {
    return Json(Either.Right(x));
};
Json.prototype.chain = function(f) {
    return Json(this.x.chain(function(x) {
        return f(x).x;
    }));
};

// Derived
Json.prototype.map = function(f) {
    return this.chain(function(a) {
        return Json.of(f(a));
    });
};
Json.prototype.readProp = function(k) {
    return this.map(function(a) {
        b = PartialLens.objectLens(k).run(a).get();
        return b.fold(
            Either.Right,
            function() {
                return Either.Left([new Error("No valid property for key (" + k + ")")]);
            }
        );
    });
};
Json.prototype.readPrimType = function(type) {
    return this.map(function(a) {
        return type(a) ?
            Either.Right(a) :
            Either.Left([new Error("Value is not of correct type.")]);
    });
};

Json.prototype.readBoolean = function() {
    return this.readPrimType(helpers.isBoolean);
};
Json.prototype.readString = function() {
    return this.readPrimType(helpers.isString);
};
Json.prototype.readNumber = function() {
    return this.readPrimType(helpers.isNumber);
};

// Static
Json.fromString = function(x) {
    try {
        str = (x instanceof String) ? x : JSON.stringify(x);
        return Json(Either.Left(JSON.parse(str)));
    } catch(e) {
        return Json(Either.Right([e]));
    }
};

// Export
if(typeof module != 'undefined')
    module.exports = Json;
