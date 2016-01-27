'use strict'

var bitcore = require('bitcore-lib'),
    utils = require('./lib/utils')

module.exports = {
    PrivateKeychain: require('./lib/private-keychain'),
    PublicKeychain: require('./lib/public-keychain'),
    HDPrivateKey: bitcore.HDPrivateKey,
    HDPublicKey: bitcore.HDPublicKey,
    PrivateKey: bitcore.PrivateKey,
    PublicKey: bitcore.PublicKey,
    Address: bitcore.Address,
    deriveHDKeychain: utils.deriveHDKeychain
}
