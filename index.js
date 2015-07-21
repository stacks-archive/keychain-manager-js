'use strict'

var BigNumber = require('bn.js')

var bitcore = require('bitcore')
var HDPrivateKey = bitcore.HDPrivateKey
var HDPublicKey = bitcore.HDPublicKey
var PublicKey = bitcore.PublicKey
var PrivateKey = bitcore.PrivateKey
var sha256 = bitcore.crypto.Hash.sha256

var Message = require('bitcore-message')

/* Private Keychain Box */

function Keylocker(keyString) {
    if (keyString) {
        this.masterKey = new HDPrivateKey(keyString)
    } else {
        this.masterKey = new HDPrivateKey()
    }
}

Keylocker.prototype.getKeychain = function(accountNumber) {
    var keychainMasterKey = this.masterKey.derive(accountNumber, true)
    var keychain = new Keychain(keychainMasterKey.toString(), accountNumber)
    return keychain
}

Keylocker.prototype.getLockchain = function(accountNumber) {
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
        this.masterKey = new HDPrivateKey(keyString)
    } else {
        throw "a private key string is required"
    }
}

Keychain.prototype.getLockchain = function() {
    var chainmasterLock = this.masterKey.hdPublicKey
    var lockchain = new Lockchain(chainmasterLock.toString(), this.accountNumber)
    return lockchain
}

Keychain.prototype.getChainPathHashBuffer = function(keyName) {
    var chainPathBuffer = new Buffer(this.masterKey.toString() + keyName)
    var chainPathHashBuffer = sha256(chainPathBuffer)
    return chainPathHashBuffer
}

Keychain.prototype.getChainPathHash = function(keyName) {
    var chainPathHashBuffer = this.getChainPathHashBuffer(keyName)
    var chainPathHashHexString = chainPathHashBuffer.toString('hex')
    return chainPathHashHexString
}

Keychain.prototype.getKey = function(keyName) {
    var chainPathHash = this.getChainPathHash(keyName)
    var chainPathBigNumber = new BigNumber(chainPathHash, 16)
    
    var key = this.masterKey
    for (var index in chainPathBigNumber.words) {
        key = key.derive(chainPathBigNumber.words[index], false)
    }
    key = key.privateKey

    return key
}

Keychain.prototype.signWithKey = function(keyName, message) {
    var key = this.getKey(keyName)
    var signature = Message(message).sign(key)
    return signature
}


/* Public Keychain */

function Lockchain(lockString, accountNumber) {
    if (accountNumber) {
        this.accountNumber = accountNumber
    }
    if (lockString) {
        this.masterLock = HDPublicKey(lockString)
    } else {
        throw "a public key string is required"
    }
}

Lockchain.prototype.getLock = function(chainPathHash) {
    var chainPathBigNumber = new BigNumber(chainPathHash, 16)

    var lock = this.masterLock
    for (var index in chainPathBigNumber.words) {
        lock = lock.derive(chainPathBigNumber.words[index], false)
    }
    lock = lock.publicKey

    return lock
}

Lockchain.prototype.checkSignature = function(message, signature, chainPathHash) {
    var lock = this.getLock(chainPathHash)
    var address = lock.toAddress()
    var messageVerified = Message(message).verify(address, signature)
    return messageVerified
}

module.exports = {
    Keylocker: Keylocker,
    Keychain: Keychain,
    Lockchain: Lockchain,
    HDPrivateKey: HDPrivateKey,
    HDPublicKey: HDPublicKey,
    PrivateKey: PrivateKey,
    PublicKey: PublicKey
}
