'use strict'

var HDPrivateKeychain = require('bitcore').HDPrivateKey,
    sha256 = require('bitcore').crypto.Hash.sha256,
    Message = require('bitcore-message'),
    BigNumber = require('bn.js'),
    PublicKeychain = require('./public-keychain'),
    deriveHDKeychain = require('./utils').deriveHDKeychain

function PrivateKeychain(privateKeychainString, accountNumber) {
    if (accountNumber) {
        this.accountNumber = accountNumber
    }
    if (privateKeychainString) {
        this.rootKeychain = new HDPrivateKeychain(privateKeychainString)
    } else {
        throw "a private key string is required"
    }
}

PrivateKeychain.prototype.toString = function() {
    return this.rootKeychain.toString()
}

PrivateKeychain.prototype.getPublicKeychain = function() {
    var chainMasterPublicKey = this.rootKeychain.hdPublicKey
    return new PublicKeychain(chainMasterPublicKey.toString(), this.accountNumber)
}

PrivateKeychain.prototype.getChainPathHashBuffer = function(keyName) {
    return sha256(new Buffer(this.rootKeychain.toString() + keyName))
}

PrivateKeychain.prototype.getChainPathHash = function(keyName) {
    return this.getChainPathHashBuffer(keyName).toString('hex')
}

PrivateKeychain.prototype.getPrivateKey = function(chainPathHash) {
    return deriveHDKeychain(this.rootKeychain, chainPathHash).privateKey
}

PrivateKeychain.prototype.signWithKey = function(privateKey, message) {
    return Message(message).sign(privateKey)
}

module.exports = PrivateKeychain
