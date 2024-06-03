# Class: IdProvider

Provides a mechanism for generating unique identifiers using the `nanoid` library.
This class supports customization of the character set used for generating the IDs.

Usage example:
```typescript
const idProvider = new IdProvider();
const uniqueId = await idProvider.provideNanoId();

console.log("Generated ID:", uniqueId);
// Generated ID:R6RJQPHJFGKDNV0ah
```

## Constructors

### new IdProvider()

> **new IdProvider**(`alphabet`?): [`IdProvider`](IdProvider.md)

Initializes a new instance of the IdProvider class.

#### Parameters

• **alphabet?**: `string`

Optional custom alphabet for ID generation. If not provided, a default set is used.

#### Returns

[`IdProvider`](IdProvider.md)

#### Source

[packages/core/src/utils/nanoid.ts:29](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/utils/nanoid.ts#L29)

## Properties

### \_alphabet

> `private` **\_alphabet**: `string` = `'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz@'`

The alphabet set used for generating the IDs. Can be customized via the constructor.

#### Source

[packages/core/src/utils/nanoid.ts:21](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/utils/nanoid.ts#L21)

## Methods

### provideNanoId()

> **provideNanoId**(`size`): `Promise`\<`string`\>

Generates a unique identifier using the custom alphabet set.

#### Parameters

• **size**: `number`= `17`

The length of the generated ID. Default is 17 characters.

#### Returns

`Promise`\<`string`\>

A promise that resolves to a unique identifier string.

#### Source

[packages/core/src/utils/nanoid.ts:61](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/utils/nanoid.ts#L61)

***

### imports()

> `static` **imports**(): `Promise`\<`object`\>

Imports and provides access to `nanoid` functions: `nanoid`, `customAlphabet`, and `customRandom`.
This method dynamically imports the `nanoid` module, which must be installed in the environment.

#### Returns

`Promise`\<`object`\>

A promise that resolves to the `nanoid` module functions.

##### customAlphabet()

> **customAlphabet**: (`alphabet`, `defaultSize`?) => (`size`?) => `string`

Generate secure unique ID with custom alphabet.

Alphabet must contain 256 symbols or less. Otherwise, the generator
will not be secure.

###### Parameters

• **alphabet**: `string`

Alphabet used to generate the ID.

• **defaultSize?**: `number`

Size of the ID. The default size is 21.

###### Returns

`Function`

A random string generator.

```js
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('0123456789абвгдеё', 5)
nanoid() //=> "8ё56а"
```

###### Parameters

• **size?**: `number`

###### Returns

`string`

##### customRandom()

> **customRandom**: (`alphabet`, `size`, `random`) => () => `string`

Generate unique ID with custom random generator and alphabet.

Alphabet must contain 256 symbols or less. Otherwise, the generator
will not be secure.

```js
import { customRandom } from 'nanoid/format'

const nanoid = customRandom('abcdef', 5, size => {
  const random = []
  for (let i = 0; i < size; i++) {
    random.push(randomByte())
  }
  return random
})

nanoid() //=> "fbaef"
```

###### Parameters

• **alphabet**: `string`

Alphabet used to generate a random string.

• **size**: `number`

Size of the random string.

• **random**

A random bytes generator.

###### Returns

`Function`

A random string generator.

###### Returns

`string`

##### nanoid()

> **nanoid**: (`size`?) => `string`

Generate secure URL-friendly unique ID.

By default, the ID will have 21 symbols to have a collision probability
similar to UUID v4.

```js
import { nanoid } from 'nanoid'
model.id = nanoid() //=> "Uakgb_J5m9g-0JDMbcJqL"
```

###### Parameters

• **size?**: `number`

Size of the ID. The default size is 21.

###### Returns

`string`

A random string.

#### Throws

An error if the `nanoid` module cannot be loaded or is not installed.

#### Source

[packages/core/src/utils/nanoid.ts:40](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/utils/nanoid.ts#L40)
