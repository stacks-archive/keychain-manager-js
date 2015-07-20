'use strict'

var test = require('tape')
var index = require('./index')
var KeychainBox = index.KeychainBox,
    Keychain = index.Keychain,
    Lockchain = index.Lockchain
var bitcore = require('bitcore')
var HDPrivateKey = bitcore.HDPrivateKey,
    HDPublicKey = bitcore.HDPublicKey

/* KeychainBox Tests */

var keychainBox = null,
    keychain = null,
    lockchain = null,
    accountNumber = 0,
    keyName = 'blockstack.org',
    key = null,
    message = 'Hello, World!',
    signature = null,
    chainPathHashBuffer = null,
    chainPathHashHex = null,
    lock = null

test('initKeychainBox', function(t) {
    t.plan(3)
    
    keychainBox = new KeychainBox()
    t.ok(keychainBox, 'keychain box created')
    t.ok(keychainBox.masterKey, 'keychain box master key created')
    t.ok(keychainBox.masterKey instanceof HDPrivateKey, 'keychain box master key is an HDPrivateKey')
})

test('initKeychainBoxFromSeed', function(t) {
    t.plan(4)
    
    var privateKeyString = 'xprv9s21ZrQH143K4VRgygdbT9byKkWYJ5R73kNvFePJ7Hh7gA1Jic4NV4AnZmYs3fftKRdzMCHEaUFuYg7aApu99RDj9ZfA6KRXniK6r3VYRPV';
    keychainBox = new KeychainBox(privateKeyString)
    t.ok(keychainBox, 'keychain box created')
    t.ok(keychainBox.masterKey, 'keychain box master key created')
    t.equal(keychainBox.masterKey.toString(), privateKeyString, 'master key equal to master key seed')
    t.ok(keychainBox.masterKey instanceof HDPrivateKey, 'master key is an HDPrivateKey')
})

test('createKeychain', function(t) {
    t.plan(3)

    keychain = keychainBox.getKeychain(accountNumber)
    t.ok(keychain, 'keychain created')
    t.ok(keychain.masterKey, 'keychain master key created')    
    t.ok(keychain.masterKey instanceof HDPrivateKey)
})

test('createLockchainFromKeychainBox', function(t) {
    t.plan(3)

    lockchain = keychainBox.getLockchain(accountNumber)
    t.ok(lockchain, 'lockchain created')
    t.ok(lockchain.masterLock, 'lockchain master lock created')
    t.ok(lockchain.masterLock instanceof HDPublicKey, 'lockchain master lock is an HDPublicKey')
})

/* Keychain Tests */

test('createLockchainFromKeychain', function(t) {
    t.plan(4)

    var lockchain2 = keychain.getLockchain()
    t.ok(lockchain2, 'lockchain created')
    t.ok(lockchain2.masterLock, 'lockchain master lock created')
    t.ok(lockchain2.masterLock instanceof HDPublicKey, 'lockchain master lock is an HDPublicKey')

    t.equal(lockchain2.masterLock.toString(), lockchain.masterLock.toString(), 'lockchain master lock strings are equal')
})

test('getChainPathHash', function(t) {
    t.plan(2)

    chainPathHashBuffer = keychain.getChainPathHash(keyName)
    chainPathHashHex = chainPathHashBuffer.toString('hex')

    t.ok(chainPathHashBuffer, 'chain path hash created')
    t.ok(typeof chainPathHashHex === 'string', 'chain path hash is a string')
})

test('getKey', function(t) {
    t.plan(3)

    key = keychain.getKey(keyName)
    t.ok(key, 'key acquired')
    t.ok(key instanceof bitcore.PrivateKey, 'key is a PrivateKey object')
    t.ok(key.toString(), 'key can be converted to a string')
})

test('signWithKey', function(t) {
    t.plan(2)

    signature = keychain.signWithKey(keyName, message)
    t.ok(signature, 'signature created')
    t.ok(typeof signature === 'string', 'signature is a string')
})


/* Lockchain Tests */

test('getLockFromLockchain', function(t) {
    t.plan(2)

    lock = lockchain.getLock(chainPathHashHex)
    t.ok(lock, 'lock created')
    t.ok(lock instanceof bitcore.PublicKey, 'lock is a PublicKey')
})

test('checkSignature', function(t) {
    t.plan(2)

    var verified = lockchain.checkSignature(message, signature, chainPathHashHex)
    t.ok(verified, 'signature was checked')
    t.equal(verified, true, 'signature is valid')
})
