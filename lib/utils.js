'use strict'

var HDPrivateKey = require('bitcore').HDPrivateKey,
    HDPublicKey = require('bitcore').HDPublicKey

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

function deriveChildPrivateKey(keychainString, chainPathHash) {
    if (keychainString.slice(0,4) !== 'xprv') {
        throw 'keychain string must be a valid HD private key'
    }
    var keychain = HDPrivateKey(keychainString)
    return deriveHDKeychain(keychain, chainPathHash).privateKey.toString()
}

function deriveChildPublicKey(keychainString, chainPathHash) {
    if (keychainString.slice(0,4) !== 'xpub') {
        throw 'keychain string must be a valid HD public key'
    }
    var keychain = HDPublicKey(keychainString)
    return deriveHDKeychain(keychain, chainPathHash).publicKey.toString()
}

module.exports = {
    deriveHDKeychain: deriveHDKeychain,
    deriveChildPrivateKey: deriveChildPrivateKey,
    deriveChildPublicKey: deriveChildPublicKey
}