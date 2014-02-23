var λ = require('fantasy-check/src/adapters/nodeunit'),
    applicative = require('fantasy-check/src/laws/applicative'),
    functor = require('fantasy-check/src/laws/functor'),
    monad = require('fantasy-check/src/laws/monad'),

    helpers = require('fantasy-helpers'),
    combinators = require('fantasy-combinators'),
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
    'Associativity (Monad)': monad.associativity(λ)(Json, run)
};
