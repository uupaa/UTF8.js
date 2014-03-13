UTF8.js
=========

Convert UTF16(JavaScript String) to UTF8.

# Document

https://github.com/uupaa/UTF8.js/wiki/UTF8

# How to use

```js
<script src="lib/UTF8.js">
<script>
// for Browser
console.log( UTF8() );
</script>
```

```js
// for WebWorkers
importScripts("lib/UTF8.js");
console.log( UTF8() );
```

```js
// for Node.js
var UTF8 = require("lib/UTF8.js");
console.log( UTF8() );
```

# for Developers

1. Install development dependency tools

    ```sh
    $ brew install closure-compiler
    $ brew install node
    $ npm install -g plato
    ```

2. Clone Repository and Install

    ```sh
    $ git clone git@github.com:uupaa/UTF8.js.git
    $ cd UTF8.js
    $ npm install
    ```

3. Build and Minify

    `$ npm run build`

4. Test

    `$ npm run test`

5. Lint

    `$ npm run lint`

