# Keychain Manager JS

Keychain Manager JS is a key system that helps you better manager your keys. It's based around accounts with hierarchical deterministic (HD) keychains made up of ECDSA keypairs (the ones Bitcoin uses).

### Getting started

```
$ npm install keychain-manager
```

```js
var PrivateKeychain = require('keychain-manager').PrivateKeychain,
    PublicKeychain = require('keychain-manager').PublicKeychain
```

### Terminology

Here we use the terminology that is a bit different from the terminology in other HD key systems, like in the original BIP32 proposal.

We take "keychain" to mean a hierarchical deterministic BIP32 key, where any number of keys can be derived from it.

In addition, a "private keychain" is an HD private key, a "public keychain" is an HD private key, a "child keychain" is an unhardened HD child key, an "account keychain" is a hardened HD child key, a "descendant keychain" is a keychain that has gone through a series of child derivations (because a descendant is a child of a child), and a "descendant key" is the key that corresponds to the descendant keychain.

### Private Keychain

First, create a master private keychain, which represents the root or master private key for an application and/or device. Account-specific private keys can be derived from it, which can then be used to derive account-specific public keychains.

```js
> var masterPrivateKeychain = new PrivateKeychain()
> masterPrivateKeychain.toString()
'xprv9s21ZrQH143K3puYL6fQ9N43ZuSDpUtf9ax1Kg5TD8J5pPziJnZgjtAaJffZMCVejtaizxdnptbBW794o5bphUZufTt5SpNCowdV19o6vLm'
```

Next, derive an account-level private keychain from the master private keychain.

Note that this derivation process uses hardening of hierarchical deterministic keys. This means that knowledge of an account private keychain derived from the master private keychain does not provide knowledge of the master keychain.

```js
> var accountPrivateKeychain = masterPrivateKeychain.account(accountNumber)
> accountPrivateKeychain.toString()
'xprv9uCwWmgt46hTx1u7YnrQHLtoArGLSwaoXUvF2gP2gmdoSkuW37AykJmR5b1szgjBgT8ZFhcp8uR1eyvg1mugitTDZtTG55cLWfgaj1GjQ7c'
```

Now use that account private keychain to derive an account public keychain.

```js
> var accountPublicKeychain = accountPrivateKeychain.publicKeychain()
> accountPublicKeychain.toString()
'xpub68CHvHDmtUFmAVyaepPQeUqXit6prQJethqqq4neF7AnKZEeaeVEJ75tvpwmKWahGfthh1BGBjr3GRfezEZ4DQvA3g8nY6cnjro3G84EucB'
```

Next, create a descendant private key from the account private keychain, which is essentially the private key of a keychain that has undergone many steps of unhardened derivation.

Descendant keys preserve privacy in that knowledge of the account public keychain does not lead to knowledge of the descendant keys. This is because even though they don't use hardening, the derivation process involves approximately 256 bits of derivation, which makes it intractable to brute-force the path from the descendant public key to the ancestor public key.

At the same time, be careful not to reveal any descendant private keys to anyone, as knowledge of the descendant private keychain can lead to knowledge of the account private keychain.

```js
> chainPathHash = accountPrivateKeychain.secretHash('blockstack.org')
'548a2bed67ab915af478d616b169992fa1716a7cef058ef4f979ece35c01e0f5'
> var privateKey = accountPrivateKeychain.descendant(chainPathHash).privateKey()
> privateKey.toString()
'79a4df0a669f00b5525104f31a84d9930f45449ddc8a4ef5786caff31a83c8c2'
```

Alternatively, if you don't want to use descendant keys, you can work with standard unhardened child keys. Just keep in mind they don't preserve privacy in the same way.

```js
> var childNumber = 2
> var childPrivateKeychain = accountPrivateKeychain.child(childNumber)
> childPrivateKeychain.toString()
'xprv9wHk2g4f6AM8CBvb2NSLavSnSFvwu5nBzijwBfG65qj7DhzuDQkuMM6xuhwi39MkT13JDYsSCEtdHw74xpVnFVBZQK3zgygtsWfWuTasw6v'
```

### Public Keychain

Create a descendant public key from the account public keychain. Use the chain path hash from before.

```js
> var chainPathHash = '548a2bed67ab915af478d616b169992fa1716a7cef058ef4f979ece35c01e0f5'
> var descendantPublicKey = accountPublicKeychain.descendant(chainPathHash).publicKey()
> descendantPublicKey.toString()
'03630ebc01c59b09f47be418c694a6136c9bfa6db5cfd55a6628fd1165489ae672'
```

Verify that the descendant public key derived here matches the public key of the descendant private key derived earlier.

```js
> privateKey.publicKey.toString()
'03630ebc01c59b09f47be418c694a6136c9bfa6db5cfd55a6628fd1165489ae672'
```

Alternatively, if you don't want to use descendant public keys, you can work with one-off unhardened child public keys. Just keep in mind they don't preserve privacy in the same way that descendant public keys do.

```js
> var childPublicKeychain = accountPublicKeychain.child(childNumber)
> childPublicKeychain.toString()
'xpub6AH6SBbYvXuRQg148PyLx4PWzHmSJYW3MwfXz3fheBG66WL3kx59u9RSkzHdfdtPbVZFSoFnpNLejHY4r8hyzHnnmbc3AhPG4TM5P3Tmi4P'
```
