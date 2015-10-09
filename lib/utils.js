'use strict'

var HDPrivateKey = require('bitcore').HDPrivateKey,
    HDPublicKey = require('bitcore').HDPublicKey

function zeroPad(s, numCharacters) {
    return (Array(numCharacters).join('0') + s).slice(-numCharacters)
}

function deriveHDKeychain(parentKeychain, chainPathHash) {
    var currentKeychain = parentKeychain,
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
    deriveHDKeychain: deriveHDKeychain,
    zeroPad: zeroPad
}