'use strict'

var HDPrivateKey = require('bitcore').HDPrivateKey,
    PrivateKeychain = require('./private-keychain'),
    PublicKeychain = require('./public-keychain')

function KeychainGenerator(keyString) {
    if (keyString) {
        this.masterKeychain = new HDPrivateKey(keyString)
    } else {
        this.masterKeychain = new HDPrivateKey()
    }
}

KeychainGenerator.prototype.getPrivateKeychain = function(accountNumber) {
    var keychainMasterKey = this.masterKeychain.derive(accountNumber, true)
    return new PrivateKeychain(keychainMasterKey.toString(), accountNumber)
}

KeychainGenerator.prototype.getPublicKeychain = function(accountNumber) {
    return this.getPrivateKeychain(accountNumber).getPublicKeychain()
}

module.exports = KeychainGenerator