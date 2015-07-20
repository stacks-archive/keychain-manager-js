'use strict'

var bitcore = require('bitcore')
var bitcoreMessage = require('bitcore-message')

/* Private Keychain Box */

function KeychainBox(keyString) {
    if (keyString) {
        this.masterKey = new bitcore.HDPrivateKey(keyString)
    } else {
        this.masterKey = new bitcore.HDPrivateKey()
    }
}

KeychainBox.prototype.getKeychain = function(accountNumber) {
    var keychainMasterKey = this.masterKey.derive(accountNumber, true)
    var keychain = new Keychain(keychainMasterKey.toString(), accountNumber)
    return keychain
}

KeychainBox.prototype.getLockchain = function(accountNumber) {
    var keychain = this.getKeychain(accountNumber)
    var lockchain = keychain.getLockchain()
    return lockchain
}

/* Private Keychain */

function Keychain(keyString, accountNumber) {
    if (accountNumber) {
        this.accountNumber = accountNumber
    }
    if (keyString) {
        this.masterKey = new bitcore.HDPrivateKey(keyString)
    } else {
        throw "a private key string is required"
    }
}

Keychain.prototype.getLockchain = function() {
    var chainMasterLock = this.masterKey.hdPublicKey
    var lockchain = new Lockchain(chainMasterLock.toString(), this.accountNumber)
    return lockchain
}

Keychain.prototype.getChainPathHash = function(keyName) {
    var chainPathBuffer = new Buffer(this.masterKey.toString() + keyName)
    var chainPathHashBuffer = bitcore.crypto.Hash.sha256(chainPathBuffer)
    return chainPathHashBuffer
}

Keychain.prototype.getKey = function(keyName) {
    var chainPathHashBuffer = this.getChainPathHash(keyName)
    var chainPathBigNumber = bitcore.crypto.BN.fromBuffer(chainPathHashBuffer)
    
    var key = this.masterKey
    for (var index in chainPathBigNumber.words) {
        key = key.derive(chainPathBigNumber.words[index], false)
    }
    key = key.privateKey

    return key
}

Keychain.prototype.signWithKey = function(keyName, message) {
    var key = this.getKey(keyName)
    var signature = bitcoreMessage(message).sign(key)
    return signature
}


/* Public Keychain */

function Lockchain(lockString, accountNumber) {
    if (accountNumber) {
        this.accountNumber = accountNumber
    }
    if (lockString) {
        this.masterLock = bitcore.HDPublicKey(lockString)
    } else {
        throw "a public key string is required"
    }
}

Lockchain.prototype.getLock = function(chainPathHashHex) {
    var chainPathHashBuffer = new Buffer(chainPathHashHex, 'hex')
    var chainPathBigNumber = bitcore.crypto.BN.fromBuffer(chainPathHashBuffer)

    var lock = this.masterLock
    for (var index in chainPathBigNumber.words) {
        lock = lock.derive(chainPathBigNumber.words[index], false)
    }
    lock = lock.publicKey

    return lock
}

Lockchain.prototype.checkSignature = function(message, signature, chainPathHashHex) {
    var lock = this.getLock(chainPathHashHex)
    var address = lock.toAddress()
    var messageVerified = bitcoreMessage(message).verify(address, signature)
    return messageVerified
}

module.exports = {
    KeychainBox: KeychainBox,
    Keychain: Keychain,
    Lockchain: Lockchain
}
