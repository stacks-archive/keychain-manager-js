'use strict'

var HDPrivateKey = require('bitcore').HDPrivateKey,
    HDPublicKey = require('bitcore').HDPublicKey,
    Message = require('bitcore-message'),
    BigNumber = require('bn.js'),
    deriveChildKeychain = require('./utils').deriveChildKeychain

function PublicKeychain(publicKeychainString, accountNumber) {
    if (accountNumber) {
        this.accountNumber = accountNumber
    }
    if (publicKeychainString) {
        this.masterKeychain = HDPublicKey(publicKeychainString)
    } else {
        throw "a public key string is required"
    }
}

PublicKeychain.prototype.getPublicKey = function(chainPathHash) {
    return deriveChildKeychain(this.masterKeychain, chainPathHash).publicKey
}

PublicKeychain.prototype.getAddress = function(chainPathHash) {
    return this.getPublicKey(chainPathHash).toAddress()
}

PublicKeychain.prototype.signatureMatchesAddress = function(message, signature, address) {
    return Message(message).verify(address, signature)
}

PublicKeychain.prototype.signatureMatchesChainPath = function(message, signature, chainPathHash) {
    var address = this.getAddress(chainPathHash)
    return this.signatureMatchesAddress(message, signature, address)
}

module.exports = PublicKeychain
