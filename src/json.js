var daggy = require('daggy'),
    helpers = require('fantasy-helpers'),
    c = require('fantasy-combinators'),
    lenses = require('fantasy-lenses'),
    Option = require('fantasy-options').Option,
    Either = require('fantasy-eithers'),

    lens = lenses.Lens.objectLens,
    pLens = lenses.PartialLens.objectLens,
    compose = c.compose,
    identity = c.identity,
    constant = c.constant,

    Json = daggy.tagged('x');

// Methods
Json.of = function (x) { 
    return Json(Option.Some(x));
};
Json.empty = function () {
    return Json.of({});
};
Json.prototype.chain = function (f) {
    return Json(this.x.chain(function (x) {
        return f(x).x;
    }));
};
Json.prototype.fold = function (f, g) {
    return Json(this.x.fold(f, g));
};
// Derived
Json.prototype.map = function (f) {
    return this.chain(function (a) {
        return Json.of(f(a));
    });
};
Json.prototype.ap = function (a) {
    return Json(this.x.chain(function(f) {
        return a.x.map(f);
    }));
};
Json.prototype.read = function (k) {
    return this.chain(function (a) {
        var store = pLens(k).run(a);
        return store.fold(
            function (b) {
                return Json(Option.from(b.get()));
            },
            function () {
                return Json(Option.None);
            }
        );
    });
};
Json.prototype.readAp = function (o) {
    return this.read(o.fold(identity, constant('')));
};
Json.prototype.write = function (k, v) {
    return this.chain(function (a) {
        return Json(Option.from(lens(k).run(a).set(v)));
    });
};
Json.prototype.writeAp = function (o, v) {
    return this.write(o.fold(identity, constant('')), v);
};

Json.prototype.readAsType = function (type) {
    return this.chain(function (a) {
        return type(a) ?
            Json(Option.of(a)) :
            Json(Option.None);
    });
};
Json.prototype.readAsBoolean = function () {
    return this.readAsType(helpers.isBoolean);
};
Json.prototype.readAsString = function () {
    return this.readAsType(helpers.isString);
};
Json.prototype.readAsNumber = function () {
    return this.readAsType(helpers.isNumber);
};
Json.prototype.readAsArray = function () {
    return this.readAsType(helpers.isArray);
};
Json.prototype.readAsObject = function () {
    return this.readAsType(helpers.isObject);
};

// Common
Json.prototype.end = function (f) {
    return this.chain(compose(constant(Option.None))(f));
};
// Extract context value
Json.prototype.extract = function () {
    return this.x;
};
Json.prototype.toString = function () {
    return this.x.fold(
        constant(''),
        function (x) {
            return (x instanceof String) ? x : JSON.stringify(x);
        }
    );
};
Json.fromString = function (x) {
    try {
        str = (x instanceof String) ? x : JSON.stringify(x);
        return Json(Option.from(JSON.parse(str)));
    } catch (e) {
        return Json(Option.None);
    }
};

// Export
if (typeof module != 'undefined')
    module.exports = Json;
