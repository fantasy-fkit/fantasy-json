var daggy = require('daggy'),
    Either = require('fantasy-eithers'),

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

// 
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