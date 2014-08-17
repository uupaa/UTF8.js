# UTF8.js [![Build Status](https://travis-ci.org/uupaa/UTF8.js.png)](http://travis-ci.org/uupaa/UTF8.js)

[![npm](https://nodei.co/npm/uupaa.utf8.js.png?downloads=true&stars=true)](https://nodei.co/npm/uupaa.utf8.js/)

Convert UTF16(JavaScript String) to UTF8.

## Document

- [UTF8.js wiki](https://github.com/uupaa/UTF8.js/wiki/UTF8)
- [Development](https://github.com/uupaa/WebModule/wiki/Development)
- [WebModule](https://github.com/uupaa/WebModule)
    - [Slide](http://uupaa.github.io/Slide/slide/WebModule/index.html)
    - [Development](https://github.com/uupaa/WebModule/wiki/Development)


## How to use

### Browser

```js
<script src="lib/UTF8.js"></script>
<script>

var source = "\u3042\u3044\u3046\u3048\u304a"; // <japanese> A I U E O </japanese>
console.log( UTF8.fromString( source ) );

</script>
```

### WebWorkers

```js
importScripts("lib/UTF8.js");

var source = "\u3042\u3044\u3046\u3048\u304a";
console.log( UTF8.fromString( source ) );
```

### Node.js

```js
var UTF8 = require("lib/UTF8.js");

var source = "\u3042\u3044\u3046\u3048\u304a";
console.log( UTF8.fromString( source ) );
```
