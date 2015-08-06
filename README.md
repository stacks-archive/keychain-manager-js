# Key-HQ

A key system based around accounts that each have hierarchical deterministic keychains with ECDSA keypairs (the ones Bitcoin uses).

### Keylocker

A keylocker is the highest level abstraction of keys. In a sense, it represents the master private key for the application and/or device. Account-specific keychains can be derived from it, as well as account-specific public keychains or "lockchains."

Note that knowledge of the master key of a keychain derived from the keylocker does not provide knowledge of the master key of the keylocker.

```js
var keyhq = require('key-hq'),
    Keylocker = keyhq.Keylocker,
    Keychain = keyhq.Keychain,
    Lockchain = keyhq.Lockchain

var keylocker = new Keylocker()
```

### Keychain

A keychain is a collection of private keys with a chain-specific master key or "ancestor" key that helps derive all of the child keys.

A keychain must be derived from a keylocker and cannot be created on it's own.

Note that every private key in the keychain can be traced back to the ancestor key in the chain. That said, with a chain path with enough entropy, it would be intractable to brute-force the path from the child private key to the ancestor private key.

```js
var accountNumber = 0,
    keyName = 'blockstack.org',
    message = 'Hello, World!'

var keychain = keylocker.getKeychain(accountNumber)
var key = keychain.getKey(keyName)
var chainPathHash = keychain.getChainPathHash(keyName)
var signature = keychain.signWithKey(keyName, message)
```

### Lockchain

A lockchain is essentially a public keychain, where each lock in the chain is a public key, and every lock may be unlocked by the corresponding key in the corresponding keychain.

A lockchain may be derived either from the corresponding keychain OR directly from a keylocker.

Note that every lock (public key) in the lockchain can be traced back to the ancestor lock in the chain. But again, if the chain path is random and long enough, it would be intractable to brute-force the path from the child lock (public key) to the ancestor lock (public key).

```js
var lockchain = keychain.getLockchain()
var lockchainFromKeylocker = keylocker.getLockchain(accountNumber)
var lock = lockchain.getLock(chainPathHash)
var address = lockchain.getAddress(chainPathHash)
var signatureVerified = lockchain.signatureMatchesChainPath(message, signature, chainPathHash)
var signatureReverified = lockchain.signatureMatchesAddress(message, signature, address)
```
