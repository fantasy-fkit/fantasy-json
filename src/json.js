var daggy = require('daggy'),
    helpers = require('fantasy-helpers'),
    Either = require('fantasy-eithers'),
    Option = require('fantasy-options'),
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
        var value = PartialLens.objectLens(k).run(a).get();
        return value.fold(
            Either.Right,
            function() {
                return Either.Left([new Error("No valid property for key (" + k + ")")]);
            }
        );
    });
};
Json.prototype.writeProp = function(k, v) {
    return this.map(function(a) {
        var lens = PartialLens.objectLens(k).run(a),
            value = lens.get();
        return value.fold(
            function(b) {
                return Either.Right(lens.set(v));
            },
            function() {
                return Either.Left([new Error("No valid property for key (" + k + ")")]);
            }
        );
    });
};

Json.prototype.readAsType = function(type) {
    return this.map(function(a) {
        return type(a) ?
            Either.Right(a) :
            Either.Left([new Error("Value is not of correct type.")]);
    });
};
Json.prototype.readAsBoolean = function() {
    return this.readAsType(helpers.isBoolean);
};
Json.prototype.readAsString = function() {
    return this.readAsType(helpers.isString);
};
Json.prototype.readAsNumber = function() {
    return this.readAsType(helpers.isNumber);
};
Json.prototype.readAsArray = function() {
    return this.readAsType(helpers.isArray);
};
Json.prototype.readAsObject = function() {
    return this.readAsType(helpers.isObject);
};

// Static
Json.prototype.toString = function() {
    return this.x.fold(
        Option.None,
        Option.Some
    );
};
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
