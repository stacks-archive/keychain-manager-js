'use strict'

var bitcore = require('bitcore'),
    utils = require('./lib/utils')

module.exports = {
    KeychainGenerator: require('./lib/keychain-generator'),
    PrivateKeychain: require('./lib/private-keychain'),
    PublicKeychain: require('./lib/public-keychain'),
    HDPrivateKey: bitcore.HDPrivateKey,
    HDPublicKey: bitcore.HDPublicKey,
    PrivateKey: bitcore.PrivateKey,
    PublicKey: bitcore.PublicKey,
    Address: bitcore.Address,
    deriveHDKeychain: utils.deriveHDKeychain,
    deriveChildPrivateKey: utils.deriveChildPrivateKey,
    deriveChildPublicKey: utils.deriveChildPublicKey
}
