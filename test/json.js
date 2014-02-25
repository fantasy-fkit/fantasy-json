var λ = require('fantasy-check/src/adapters/nodeunit'),
    applicative = require('fantasy-check/src/laws/applicative'),
    functor = require('fantasy-check/src/laws/functor'),
    monad = require('fantasy-check/src/laws/monad'),

    helpers = require('fantasy-helpers'),
    combinators = require('fantasy-combinators'),
    equality = require('fantasy-equality'),
    Json = require('../fantasy-json'),

    identity = combinators.identity;

function run(a) {
    return a.x;
}

exports.json = {

    // Functor tests
    'All (Functor)': functor.laws(λ)(Json.of, run),
    'Identity (Functor)': functor.identity(λ)(Json.of, run),
    'Composition (Functor)': functor.composition(λ)(Json.of, run),

    // Monad tests
    'All (Monad)': monad.laws(λ)(Json, run),
    'Left Identity (Monad)': monad.leftIdentity(λ)(Json, run),
    'Right Identity (Monad)': monad.rightIdentity(λ)(Json, run),
    'Associativity (Monad)': monad.associativity(λ)(Json, run),

    // Manual tests
    'when using fromString should be the same as of': λ.check(
        function(a) {
            var x = Json.fromString(JSON.stringify(a)),
                y = Json.of(a);
            return equality.equals(x, y);
        },
        [λ.objectLike({
            a: Number,
            b: Object
        })]
    ),
    'when using readProp to alter value should return correct object': λ.check(
        function(a) {
            var x = Json.of(a.a),
                y = Json.of(a).readProp('a');

            return equality.equals(x.x, y.x);
        },
        [λ.objectLike({
            a: Number,
            b: Object
        })]
    ),
    'when using readProp to alter value should not return correct object': λ.check(
        function(a) {
            var x = Json.of(a.a),
                y = Json.of(a).readProp('v');

            return !equality.equals(x.x, y.x);
        },
        [λ.objectLike({
            a: Number,
            b: Object
        })]
    ),
    'when using writeProp to alter value should return correct object': λ.check(
        function(a) {
            var x = Json.of(JSON.parse(JSON.stringify(a))),
                y = Json.of(a).writeProp('a', a.a + 1);

            // Mutate the state to test against!
            x.x.r.a += 1;

            return equality.equals(x.x, y.x);
        },
        [λ.objectLike({
            a: Number,
            b: Object
        })]
    ),
    'when using writeProp to alter value should not return correct object': λ.check(
        function(a) {
            var x = Json.of(JSON.parse(JSON.stringify(a))),
                y = Json.of(a).writeProp('v', a.a + 1);

            return !equality.equals(x.x, y.x);
        },
        [λ.objectLike({
            a: Number,
            b: Object
        })]
    ),
    'when using readAsBoolean should return correct value': λ.check(
        function(a) {
            return equality.equals(Json.of(a).readProp('a').readAsBoolean().x.r, a.a);
        },
        [λ.objectLike({
            a: Boolean,
            b: Object
        })]
    ),
    'when using readAsString should return correct value': λ.check(
        function(a) {
            return equality.equals(Json.of(a).readProp('a').readAsString().x.r, a.a);
        },
        [λ.objectLike({
            a: String,
            b: Object
        })]
    ),
    'when using readAsNumber should return correct value': λ.check(
        function(a) {
            return equality.equals(Json.of(a).readProp('a').readAsNumber().x.r, a.a);
        },
        [λ.objectLike({
            a: Number,
            b: Object
        })]
    ),
    'when using readAsArray should return correct value': λ.check(
        function(a) {
            return equality.equals(Json.of(a).readProp('a').readAsArray().x.r, a.a);
        },
        [λ.objectLike({
            a: Array,
            b: Object
        })]
    ),
    'when using readAsObject should return correct value': λ.check(
        function(a) {
            return equality.equals(Json.of(a).readProp('a').readAsObject().x.r, a.a);
        },
        [λ.objectLike({
            a: Object,
            b: Object
        })]
    )
};
