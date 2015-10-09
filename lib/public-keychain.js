'use strict'

var HDPublicKey = require('bitcore').HDPublicKey,
    BigNumber = require('bn.js'),
    deriveHDKeychain = require('./utils').deriveHDKeychain

function PublicKeychain(publicKeychainString) {
    if (publicKeychainString) {
        this.hdKeychain = HDPublicKey(publicKeychainString)
    } else {
        throw Error('a public key string is required')
    }
}

PublicKeychain.prototype.toString = function() {
    return this.hdKeychain.toString()
}

PublicKeychain.prototype.child = function(childIndex) {
    var childKeychain = this.hdKeychain.derive(childIndex)
    return new PublicKeychain(childKeychain.toString())
}

PublicKeychain.prototype.descendant = function(chainPath) {
    var descendantKeychain = deriveHDKeychain(this.hdKeychain, chainPath)
    return new PublicKeychain(descendantKeychain.toString())
}

PublicKeychain.prototype.publicKey = function() {
    return this.hdKeychain.publicKey
}

PublicKeychain.prototype.address = function() {
    return this.hdKeychain.publicKey.toAddress()
}

module.exports = PublicKeychain
