var daggy = require('daggy'),
    helpers = require('fantasy-helpers'),
    pLens = require('fantasy-lenses').PartialLens.objectLens,
    lens = require('fantasy-lenses').Lens.objectLens,
    Option = require('fantasy-options').Option,
    
    Json = daggy.tagged('x');

// Methods
Json.of = function(x) {
    return Json(Option.from(x));
};
Json.empty = function(){
    return Json.of({});
}
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
Json.prototype.read = function(k) {
    return this.chain(function(a) {
        var store = pLens(k).run(a);
        return store.fold(
            function(b) {
                return Json(Option.from(b.get()));
            },
            function() {
                return Json(Option.None);
            }
        );
    });
};
Json.prototype.write = function(k, v) {
    return this.chain(function(a) {
        return Json(Option.from(lens(k).run(a)))
    });
};

Json.prototype.readAsType = function(type) {
    return this.chain(function(a) {
        return type(a) ?
            Json(Either.Right(a)) :
            Json(Either.Left([new Error("Value is not of correct type.")]));
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
        combinators.constant(''),
        function(x) {
            return (x instanceof String) ? x : JSON.stringify(x);
        }
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
