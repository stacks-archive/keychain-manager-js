'use strict'

var test = require('tape')
var index = require('./index')
var KeychainGenerator = index.KeychainGenerator,
    PrivateKeychain = index.PrivateKeychain,
    PublicKeychain = index.PublicKeychain,
    HDPrivateKey = index.HDPrivateKey,
    HDPublicKey = index.HDPublicKey,
    PrivateKey = index.PrivateKey,
    PublicKey = index.PublicKey,
    Address = index.Address

/* keylocker Tests */

var keychainGenerator = null,
    privateKeychain = null,
    publicKeychain = null,
    accountNumber = 0,
    keyName = 'blockstack.org',
    key = null,
    message = 'Hello, World!',
    signature = null,
    chainPathHash = null,
    publicKey = null,
    address = null

test('initKeychainGenerator', function(t) {
    t.plan(3)
    
    keychainGenerator = new KeychainGenerator()
    t.ok(keychainGenerator, 'private keychain created')
    t.ok(keychainGenerator.masterKeychain, 'private keychain master key created')
    t.ok(keychainGenerator.masterKeychain instanceof HDPrivateKey, 'private keychain master key is an HDPrivateKey')
})

test('initKeychainGeneratorFromSeed', function(t) {
    t.plan(4)
    
    var privateKeyString = 'xprv9s21ZrQH143K4VRgygdbT9byKkWYJ5R73kNvFePJ7Hh7gA1Jic4NV4AnZmYs3fftKRdzMCHEaUFuYg7aApu99RDj9ZfA6KRXniK6r3VYRPV';
    keychainGenerator = new KeychainGenerator(privateKeyString)
    t.ok(keychainGenerator, 'private keychain created')
    t.ok(keychainGenerator.masterKeychain, 'private keychain master key created')
    t.equal(keychainGenerator.masterKeychain.toString(), privateKeyString, 'master key equal to master key seed')
    t.ok(keychainGenerator.masterKeychain instanceof HDPrivateKey, 'master key is an HDPrivateKey')
})

test('createPrivateKeychain', function(t) {
    t.plan(3)

    privateKeychain = keychainGenerator.getPrivateKeychain(accountNumber)
    t.ok(privateKeychain, 'private keychain created')
    t.ok(privateKeychain.masterKeychain, 'private keychain master key created')    
    t.ok(privateKeychain.masterKeychain instanceof HDPrivateKey)
})

test('createPublicKeychainFromKeychainGenerator', function(t) {
    t.plan(3)

    publicKeychain = keychainGenerator.getPublicKeychain(accountNumber)
    t.ok(publicKeychain, 'public keychain created')
    t.ok(publicKeychain.masterKeychain, 'public keychain master lock created')
    t.ok(publicKeychain.masterKeychain instanceof HDPublicKey, 'public keychain master lock is an HDPublicKey')
})

/* Private Keychain Tests */

test('createPublicKeychainFromPrivateKeychain', function(t) {
    t.plan(4)

    var publicKeychain2 = privateKeychain.getPublicKeychain()
    t.ok(publicKeychain2, 'public keychain created')
    t.ok(publicKeychain2.masterKeychain, 'public keychain master lock created')
    t.ok(publicKeychain2.masterKeychain instanceof HDPublicKey, 'public keychain master lock is an HDPublicKey')

    t.equal(publicKeychain2.masterKeychain.toString(), publicKeychain.masterKeychain.toString(), 'public keychain master lock strings are equal')
})

test('getChainPathHash', function(t) {
    t.plan(2)

    chainPathHash = privateKeychain.getChainPathHash(keyName)

    t.ok(chainPathHash, 'chain path hash created')
    t.ok(typeof chainPathHash === 'string', 'chain path hash is a string')
})

test('getKey', function(t) {
    t.plan(3)

    key = privateKeychain.getPrivateKey(chainPathHash)
    t.ok(key, 'key acquired')
    t.ok(key instanceof PrivateKey, 'key is a PrivateKey object')
    t.ok(key.toString(), 'key can be converted to a string')
})

test('signWithKey', function(t) {
    t.plan(2)

    signature = privateKeychain.signWithKey(key, message)
    t.ok(signature, 'signature created')
    t.ok(typeof signature === 'string', 'signature is a string')
})


/* Public Keychain Tests */

test('getPublicKeyFromPublicKeychain', function(t) {
    t.plan(2)

    publicKey = publicKeychain.getPublicKey(chainPathHash)
    t.ok(publicKey, 'public key created')
    t.ok(publicKey instanceof PublicKey, 'public key is a PublicKey')
})

test('getAddressFromPublicKeychain', function(t) {
    t.plan(2)

    address = publicKeychain.getAddress(chainPathHash)
    t.ok(address, 'address created')
    t.ok(address instanceof Address, 'address is an Address')
})

test('signatureMatchesChainPath', function(t) {
    t.plan(2)

    var verified = publicKeychain.signatureMatchesChainPath(message, signature, chainPathHash)
    t.ok(verified, 'signature was checked')
    t.equal(verified, true, 'signature is valid')
})

test('signatureMatchesAddress', function(t) {
    t.plan(2)

    var verified = publicKeychain.signatureMatchesAddress(message, signature, address)
    t.ok(verified, 'signature was checked')
    t.equal(verified, true, 'signature is valid')
})
