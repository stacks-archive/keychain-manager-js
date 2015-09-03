'use strict'

var BigNumber = require('bn.js')

var bitcore = require('bitcore')
var HDPrivateKey = bitcore.HDPrivateKey
var HDPublicKey = bitcore.HDPublicKey
var PublicKey = bitcore.PublicKey
var PrivateKey = bitcore.PrivateKey
var Address = bitcore.Address

var sha256 = bitcore.crypto.Hash.sha256

var KeychainGenerator = require('./lib/keychain-generator'),
    PrivateKeychain = require('./lib/private-keychain'),
    PublicKeychain = require('./lib/public-keychain'),
    deriveChildHDKey = require('./lib/utils').deriveChildHDKey

module.exports = {
    KeychainGenerator: KeychainGenerator,
    PrivateKeychain: PrivateKeychain,
    PublicKeychain: PublicKeychain,
    HDPrivateKey: HDPrivateKey,
    HDPublicKey: HDPublicKey,
    PrivateKey: PrivateKey,
    PublicKey: PublicKey,
    Address: Address,
    deriveChildHDKey: deriveChildHDKey
}
