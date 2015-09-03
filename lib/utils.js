'use strict'

function deriveChildKeychain(keychain, chainPathHash) {
    var currentKeychain = keychain,
        chainPathParts = chainPathHash.match(/.{1,8}/g),
        chainSteps = []

    chainPathParts.forEach(function(part) {
        var chainStep = parseInt(part, 16) % Math.pow(2, 31)
        chainSteps.push(chainStep)
    })

    chainSteps.forEach(function(chainStep) {
        currentKeychain = currentKeychain.derive(chainStep, false)
    })

    return currentKeychain
}

module.exports = {
    deriveChildKeychain: deriveChildKeychain
}