'use strict'

var HDPrivateKeychain = require('bitcore').HDPrivateKey,
    HDPublicKeychain = require('bitcore').HDPublicKey

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

function deriveKeychainString(keychainString, chainPathHash) {
    var keychain
    if (keychainString.slice(0,4) === 'xpub') {
        keychain = HDPublicKeychain(keychainString)
    } else if (keychainString.slice(0,4) === 'xprv') {
        keychain = HDPrivateKeychain(keychainString)
    } else {
        throw 'hdKey must be a string representation of an HD public key or HD private key'
    }
    return deriveHDKeychain(keychain, chainPathHash).toString()
}

module.exports = {
    deriveHDKeychain: deriveHDKeychain,
    deriveKeychainString: deriveKeychainString
}