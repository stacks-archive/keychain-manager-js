'use strict'

var HDPublicKey = require('bitcore').HDPublicKey,
    Message = require('bitcore-message'),
    BigNumber = require('bn.js'),
    deriveHDKeychain = require('./utils').deriveHDKeychain

function PublicKeychain(publicKeychainString, accountNumber) {
    if (accountNumber) {
        this.accountNumber = accountNumber
    }
    if (publicKeychainString) {
        this.rootKeychain = HDPublicKey(publicKeychainString)
    } else {
        throw "a public key string is required"
    }
}

PublicKeychain.prototype.toString = function() {
    return this.rootKeychain.toString()
}

PublicKeychain.prototype.getPublicKey = function(chainPathHash) {
    return deriveHDKeychain(this.rootKeychain, chainPathHash).publicKey
}

PublicKeychain.prototype.getAddress = function(chainPathHash) {
    return this.getPublicKey(chainPathHash).toAddress()
}

PublicKeychain.prototype.signatureMatchesAddress = function(message, signature, address) {
    return Message(message).verify(address, signature)
}

module.exports = PublicKeychain
