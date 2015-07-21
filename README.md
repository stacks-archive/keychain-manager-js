# keychain-box

A key system based around accounts/keychains that each have hierarchical deterministic keychains with ECDSA keypairs (the ones Bitcoin uses).

### KeychainBox

```js
var keychainBox = new KeychainBox()
```

### Keychain

```js
var accountNumber = 0,
    keyname = 'blockstack.org',
    message = 'Hello, World!'

var keychain = keychainBox.getKeychain(accountNumber)
var key = keychain.getKey(keyName)
var chainPathHashHex = keychain.getChainPathHash(keyName).toString('hex')
var signature = keychain.signWithKey(keyName, message)
```

### Lockchain

```js
var lockchain = keychain.getLockchain()
var lockchainFromKeychainBox = keychainBox.getLockchain(accountNumber)
var lock = lockchain.getLock(chainPathHashHex)
var verified = lockchain.checkSignature(message, signature, chainPathHashHex)
```
