(function(global) {
"use strict";

// --- dependency modules ----------------------------------
// --- define / local variables ----------------------------
//var _runOnNode = "process" in global;
//var _runOnWorker = "WorkerLocation" in global;
//var _runOnBrowser = "document" in global;

// --- class / interfaces ----------------------------------
function UTF8(source) { // @arg Uint32Array|IntegerArray - Unicode values.
                        // @ret Uint8Array|IntegerArray  - UTF8 values.
                        // @desc Convert Unicode(JavaScript String) to UTF8 Integer Array
//{@dev
    $valid($type(source, "Uint32Array|IntegerArray"), UTF8, "source");
//}@dev

    return UTF8_encode(source);
}

//{@dev
UTF8["repository"] = "https://github.com/uupaa/UTF8.js";
//}@dev

UTF8["fromString"] = UTF8_fromString;   // UTF8.fromString(source:String):UTF8OctetString
UTF8["toString"]   = UTF8_toString;     // UTF8.toString(source:UTF8OctetString = undefined):String
UTF8["encode"]     = UTF8_encode;       // UTF8.encode(source:Uint32Array/IntegerArray):Uint8Array/IntegerArray
UTF8["decode"]     = UTF8_decode;       // UTF8.decode(source:Uint8Array/IntegerArray):Uint32Array/IntegerArray

// --- implements ------------------------------------------
function UTF8_fromString(source) { // @arg String
                                   // @ret UTF8OctetString
//{@dev
    $valid($type(source, "String"), UTF8_fromString, "source");
//}@dev

    return unescape( encodeURIComponent(source) );
}

function UTF8_toString(source) { // @arg UTF8OctetString = undefined
                                 // @ret String
//{@dev
    $valid($type(source, "String|omit"), UTF8_toString, "source");
//}@dev

    return decodeURIComponent( escape(source || "") );
}

function UTF8_encode(source) { // @arg Uint32Array|IntegerArray - Unicode values.
                               // @ret Uint8Array|IntegerArray  - UTF8 values
                               // @desc Convert Unicode to UTF8 Integer Array.
//{@dev
    $valid($type(source, "Uint32Array|IntegerArray"), UTF8_encode, "source");
//}@dev

    var rv = [], i = 0, iz = source.length, c = 0, d = 0, u = 0;

    while (i < iz) {
        c = source[i++];
        if (c <= 0x7F) { // [1]
            // 00000000 0zzzzzzz
            rv.push(c);                                       // 0zzz zzzz (1st)
        } else if (c <= 0x07FF) { // [2]
            // 00000yyy yyzzzzzz
            rv.push(c >>>  6 & 0x1f | 0xc0,                   // 110y yyyy (1st)
                    c        & 0x3f | 0x80);                  // 10zz zzzz (2nd)
        } else if (c <= 0xFFFF) { // [3] or [5]
            if (c >= 0xD800 && c <= 0xDBFF) { // [5] Surrogate Pairs
                // 110110UU UUwwwwxx 110111yy yyzzzzzz
                d = source[i++];
                u = (c >>> 6 & 0x0f) + 1; // 0xUUUU+1 -> 0xuuuuu
                rv.push(
                     u >>>  2 & 0x07 | 0xf0,                  // 1111 0uuu (1st)
                    (u <<   4 & 0x30 | 0x80) | c >>> 2 & 0xf, // 10uu wwww (2nd)
                    (c <<   4 & 0x30 | 0x80) | d >>> 6 & 0xf, // 10xx yyyy (3rd)
                     d        & 0x3f | 0x80);                 // 10zz zzzz (4th)
            } else {
                // xxxxyyyy yyzzzzzz
                rv.push(c >>> 12 & 0x0f | 0xe0,               // 1110 xxxx (1st)
                        c >>>  6 & 0x3f | 0x80,               // 10yy yyyy (2nd)
                        c        & 0x3f | 0x80);              // 10zz zzzz (3rd)
            }
        } else if (c <= 0x10FFFF) { // [4]
            // 000wwwxx xxxxyyyy yyzzzzzz
            rv.push(c >>> 18 & 0x07 | 0xf0,                   // 1111 0www (1st)
                    c >>> 12 & 0x3f | 0x80,                   // 10xx xxxx (2nd)
                    c >>>  6 & 0x3f | 0x80,                   // 10yy yyyy (3rd)
                    c        & 0x3f | 0x80);                  // 10zz zzzz (4th)
        }
    }
    if (Array.isArray(source)) {
        return rv;
    }
    var result = new Uint8Array(rv.length);

    result.set(rv);
    return result;
}

function UTF8_decode(source) { // @arg Uint8Array|IntegerArray
                               // @ret Uint32Array|IntegerArray
                               // @desc convert UTF8 to Unicode Integer Array.
//{@dev
    $valid($type(source, "Uint8Array|IntegerArray"), UTF8_decode, "source");
//}@dev

    var rv = [], i = 0, iz = source.length;
    var c = 0, d = 0, e = 0, f = 0;
    var u = 0, w = 0, x = 0, y = 0, z = 0;

    while (i < iz) {
        c = source[i++];
        if (c < 0x80) {         // [1] 0x00 - 0x7F (1 byte)
            rv.push(c);
        } else if (c < 0xE0) {  // [2] 0xC2 - 0xDF (2 byte)
            d = source[i++];
            rv.push( (c & 0x1F) <<  6 | d & 0x3F );
        } else if (c < 0xF0) {  // [3] 0xE0 - 0xE1, 0xEE - 0xEF (3 bytes)
            d = source[i++];
            e = source[i++];
            rv.push( (c & 0x0F) << 12 | (d & 0x3F) <<  6 | e & 0x3F );
        } else if (c < 0xF5) {  // [4] 0xF0 - 0xF4 (4 bytes)
            d = source[i++];
            e = source[i++];
            f = source[i++];
            u = (((c & 0x07) << 2) | ((d >> 4) & 0x03)) - 1;
            w = d & 0x0F;
            x = (e >> 4) & 0x03;
            z = f & 0x3F;
            rv.push( 0xD8 | (u << 6) | (w << 2) | x,
                     0xDC | (y << 4) | z );
        }
    }
    if (Array.isArray(source)) {
        return rv;
    }
    var result = new Uint32Array(rv.length);

    result.set(rv);
    return result;
}

// --- validate / assertions -------------------------------
//{@dev
function $valid(val, fn, hint) { if (global["Valid"]) { global["Valid"](val, fn, hint); } }
function $type(obj, type) { return global["Valid"] ? global["Valid"].type(obj, type) : true; }
//function $keys(obj, str) { return global["Valid"] ? global["Valid"].keys(obj, str) : true; }
//function $some(val, str, ignore) { return global["Valid"] ? global["Valid"].some(val, str, ignore) : true; }
//function $args(fn, args) { if (global["Valid"]) { global["Valid"].args(fn, args); } }
//}@dev

// --- exports ---------------------------------------------
if ("process" in global) {
    module["exports"] = UTF8;
}
global["UTF8" in global ? "UTF8_" : "UTF8"] = UTF8; // switch module. http://git.io/Minify

})((this || 0).self || global); // WebModule idiom. http://git.io/WebModule

