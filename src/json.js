var daggy = require('daggy'),
    Either = require('fantasy-eithers'),

    Json = daggy.tagged('x');

// Methods
Json.of = function(x) {
    return Json(Either.Left(x));
};
Json.prototype.chain = function(f) {
    return Json(this.x.chain(function(x) {
        return f(x).x;
    }));
};

// Derived
Json.prototype.map = function(v) {
    return this.chain(function(a) {
        return Json.of(f(a));
    });
};

// 
Json.fromString = function(x) {
    try {
        return Json(Either.Left(JSON.Parse(x)));
    } catch(e) {
        return Json(Either.Right([e]));
    }
};