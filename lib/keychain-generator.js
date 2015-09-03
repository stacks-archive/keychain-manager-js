'use strict'

var HDPrivateKey = require('bitcore').HDPrivateKey,
    PrivateKeychain = require('./private-keychain'),
    PublicKeychain = require('./public-keychain')

function KeychainGenerator(keyString) {
    if (keyString) {
        this.rootKeychain = new HDPrivateKey(keyString)
    } else {
        this.rootKeychain = new HDPrivateKey()
    }
}

KeychainGenerator.prototype.toString = function() {
    return this.rootKeychain.toString()
}

KeychainGenerator.prototype.getPrivateKeychain = function(accountNumber) {
    var rootKeychain = this.rootKeychain.derive(accountNumber, true)
    return new PrivateKeychain(rootKeychain.toString(), accountNumber)
}

KeychainGenerator.prototype.getPublicKeychain = function(accountNumber) {
    return this.getPrivateKeychain(accountNumber).getPublicKeychain()
}

module.exports = KeychainGenerator