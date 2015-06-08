# UTF8.js [![Build Status](https://travis-ci.org/uupaa/UTF8.js.svg)](https://travis-ci.org/uupaa/UTF8.js)

[![npm](https://nodei.co/npm/uupaa.utf8.js.svg?downloads=true&stars=true)](https://nodei.co/npm/uupaa.utf8.js/)

Convert UTF8 to UTF16.


- UTF8.js made of [WebModule](https://github.com/uupaa/WebModule).
- [Spec](https://github.com/uupaa/UTF8.js/wiki/UTF8)

## Browser and NW.js(node-webkit)

```js
<script src="<module-dir>/lib/WebModule.js"></script>
<script src="<module-dir>/lib/UTF8.js"></script>
<script>

var source = "\u3042\u3044\u3046\u3048\u304a"; // <japanese> A I U E O </japanese>
console.log( WebModule.UTF8.fromString( source ) );

</script>
```

## WebWorkers

```js
importScripts("<module-dir>lib/WebModule.js");
importScripts("<module-dir>lib/UTF8.js");

```

## Node.js

```js
require("<module-dir>lib/WebModule.js");
require("<module-dir>lib/UTF8.js");

```

