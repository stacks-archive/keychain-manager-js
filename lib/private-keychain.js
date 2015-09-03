'use strict'

var HDPrivateKey = require('bitcore').HDPrivateKey,
    sha256 = require('bitcore').crypto.Hash.sha256,
    Message = require('bitcore-message'),
    BigNumber = require('bn.js'),
    PublicKeychain = require('./public-keychain'),
    deriveChildKeychain = require('./utils').deriveChildKeychain

function PrivateKeychain(keyString, accountNumber) {
    if (accountNumber) {
        this.accountNumber = accountNumber
    }
    if (keyString) {
        this.masterKeychain = new HDPrivateKey(keyString)
    } else {
        throw "a private key string is required"
    }
}

PrivateKeychain.prototype.getPublicKeychain = function() {
    var chainMasterPublicKey = this.masterKeychain.hdPublicKey
    return new PublicKeychain(chainMasterPublicKey.toString(), this.accountNumber)
}

PrivateKeychain.prototype.getChainPathHashBuffer = function(keyName) {
    return sha256(new Buffer(this.masterKeychain.toString() + keyName))
}

PrivateKeychain.prototype.getChainPathHash = function(keyName) {
    return this.getChainPathHashBuffer(keyName).toString('hex')
}

PrivateKeychain.prototype.getPrivateKey = function(chainPathHash) {
    return deriveChildKeychain(this.masterKeychain, chainPathHash).privateKey
}

PrivateKeychain.prototype.signWithKey = function(privateKey, message) {
    return Message(message).sign(privateKey)
}

module.exports = PrivateKeychain
