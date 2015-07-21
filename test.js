'use strict'

var test = require('tape')
var index = require('./index')
var Keylocker = index.Keylocker,
    Keychain = index.Keychain,
    Lockchain = index.Lockchain,
    HDPrivateKey = index.HDPrivateKey,
    HDPublicKey = index.HDPublicKey,
    PrivateKey = index.PrivateKey,
    PublicKey = index.PublicKey

/* keylocker Tests */

var keylocker = null,
    keychain = null,
    lockchain = null,
    accountNumber = 0,
    keyName = 'blockstack.org',
    key = null,
    message = 'Hello, World!',
    signature = null,
    chainPathHash = null,
    lock = null

test('initKeylocker', function(t) {
    t.plan(3)
    
    keylocker = new Keylocker()
    t.ok(keylocker, 'keychain box created')
    t.ok(keylocker.masterKey, 'keychain box master key created')
    t.ok(keylocker.masterKey instanceof HDPrivateKey, 'keychain box master key is an HDPrivateKey')
})

test('initkeylockerFromSeed', function(t) {
    t.plan(4)
    
    var privateKeyString = 'xprv9s21ZrQH143K4VRgygdbT9byKkWYJ5R73kNvFePJ7Hh7gA1Jic4NV4AnZmYs3fftKRdzMCHEaUFuYg7aApu99RDj9ZfA6KRXniK6r3VYRPV';
    keylocker = new Keylocker(privateKeyString)
    t.ok(keylocker, 'keychain box created')
    t.ok(keylocker.masterKey, 'keychain box master key created')
    t.equal(keylocker.masterKey.toString(), privateKeyString, 'master key equal to master key seed')
    t.ok(keylocker.masterKey instanceof HDPrivateKey, 'master key is an HDPrivateKey')
})

test('createKeychain', function(t) {
    t.plan(3)

    keychain = keylocker.getKeychain(accountNumber)
    t.ok(keychain, 'keychain created')
    t.ok(keychain.masterKey, 'keychain master key created')    
    t.ok(keychain.masterKey instanceof HDPrivateKey)
})

test('createLockchainFromkeylocker', function(t) {
    t.plan(3)

    lockchain = keylocker.getLockchain(accountNumber)
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

    chainPathHash = keychain.getChainPathHash(keyName)

    t.ok(chainPathHash, 'chain path hash created')
    t.ok(typeof chainPathHash === 'string', 'chain path hash is a string')
})

test('getKey', function(t) {
    t.plan(3)

    key = keychain.getKey(keyName)
    t.ok(key, 'key acquired')
    t.ok(key instanceof PrivateKey, 'key is a PrivateKey object')
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

    lock = lockchain.getLock(chainPathHash)
    t.ok(lock, 'lock created')
    t.ok(lock instanceof PublicKey, 'lock is a PublicKey')
})

test('checkSignature', function(t) {
    t.plan(2)

    var verified = lockchain.checkSignature(message, signature, chainPathHash)
    t.ok(verified, 'signature was checked')
    t.equal(verified, true, 'signature is valid')
})
