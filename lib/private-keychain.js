'use strict'

var HDPrivateKey = require('bitcore').HDPrivateKey,
    sha256 = require('bitcore').crypto.Hash.sha256,
    Message = require('bitcore-message'),
    BigNumber = require('bn.js'),
    PublicKeychain = require('./public-keychain'),
    deriveHDKeychain = require('./utils').deriveHDKeychain

function PrivateKeychain(privateKeychainString) {
    if (privateKeychainString) {
        this.hdKeychain = new HDPrivateKey(privateKeychainString)
    } else {
        this.hdKeychain = new HDPrivateKey()
    }
}

PrivateKeychain.prototype.toString = function() {
    return this.hdKeychain.toString()
}

PrivateKeychain.prototype.account = function(childIndex) {
    /* An account is a hardened keychain child */
    var childKeychain = this.hdKeychain.derive(childIndex, true)
    return new PrivateKeychain(childKeychain.toString())
}

PrivateKeychain.prototype.child = function(childIndex) {
    /* Every child is unhardened. For a hardened child, create an account. */
    var hdKeychain = this.hdKeychain.derive(childIndex, false)
    return new PrivateKeychain(hdKeychain.toString())
}

PrivateKeychain.prototype.publicKeychain = function() {
    var chainMasterPublicKey = this.hdKeychain.hdPublicKey
    return new PublicKeychain(chainMasterPublicKey.toString())
}

PrivateKeychain.prototype.privateKey = function() {
    return this.hdKeychain.privateKey
}

PrivateKeychain.prototype.descendant = function(chainPath) {
    /* A descendant is a child of a child of a child of a... */
    var descendantKeychain = deriveHDKeychain(this.hdKeychain, chainPath)
    return new PrivateKeychain(descendantKeychain.toString())
}

PrivateKeychain.prototype.secretHash = function(name) {
    var chainPathBuffer = sha256(new Buffer(this.hdKeychain.toString() + name))
    return chainPathBuffer.toString('hex')
}

module.exports = PrivateKeychain
