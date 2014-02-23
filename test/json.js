var λ = require('fantasy-check/src/adapters/nodeunit'),
    applicative = require('fantasy-check/src/laws/applicative'),
    functor = require('fantasy-check/src/laws/functor'),
    monad = require('fantasy-check/src/laws/monad'),

    helpers = require('fantasy-helpers'),
    combinators = require('fantasy-combinators'),
    Identity = require('../fantasy-identities');

exports.json = {

    // Functor tests
    'All (Functor)': functor.laws(λ)(Json.of, identity),
    'Identity (Functor)': functor.identity(λ)(Json.of, identity),
    'Composition (Functor)': functor.composition(λ)(Json.of, identity),

    // Monad tests
    'All (Monad)': monad.laws(λ)(Json, identity),
    'Left Identity (Monad)': monad.leftIdentity(λ)(Json, identity),
    'Right Identity (Monad)': monad.rightIdentity(λ)(Json, identity),
    'Associativity (Monad)': monad.associativity(λ)(Json, identity)
};
