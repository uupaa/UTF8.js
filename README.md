=========
UTF8.js
=========

![](https://travis-ci.org/uupaa/UTF8.js.png)

Convert UTF16(JavaScript String) to UTF8.

# Document

- [WebModule](https://github.com/uupaa/WebModule) ([Slide](http://uupaa.github.io/Slide/slide/WebModule/index.html))
- [Development](https://github.com/uupaa/WebModule/wiki/Development)
- [UTF8.js wiki](https://github.com/uupaa/UTF8.js/wiki/UTF8)


# How to use

```js
<script src="lib/UTF8.js">
<script>
// for Browser

var source = "\u3042\u3044\u3046\u3048\u304a"; // <japanese> A I U E O </japanese>
console.log( UTF8.fromString( source ) );

</script>
```

```js
// for WebWorkers
importScripts("lib/UTF8.js");

var source = "\u3042\u3044\u3046\u3048\u304a";
console.log( UTF8.fromString( source ) );
```

```js
// for Node.js
var UTF8 = require("lib/UTF8.js");

var source = "\u3042\u3044\u3046\u3048\u304a";
console.log( UTF8.fromString( source ) );
```
