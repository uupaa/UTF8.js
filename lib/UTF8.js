(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("UTF8", function moduleClosure(global) {
"use strict";

// --- dependency modules ----------------------------------
// --- define / local variables ----------------------------
// --- class / interfaces ----------------------------------
var UTF8 = {
    "Blob": {
        "fromString":   UTF8_Blob_fromString,   // UTF8.Blob.fromString(source:String):Blob
        "toString":     UTF8_Blob_toString,     // UTF8.Blob.toString(source:Blob|null, callback:Function):void
    },
    "fromString":       UTF8_fromString,        // UTF8.fromString(source:String):UTF8String
    "toString":         UTF8_toString,          // UTF8.toString(source:UTF8String|null):String
    "encode":           UTF8_encode,            // UTF8.encode(source:Uint8Array|Uint16Array|Uint32Array|String):Uint8Array
    "decode":           UTF8_decode,            // UTF8.decode(source:Uint8Array, toString:Boolean = false):Uint32Array|String
    "repository":       "https://github.com/uupaa/UTF8.js",
};

// --- implements ------------------------------------------
function UTF8_Blob_fromString(source) { // @arg String
                                        // @ret Blob
    return new Blob([source]);
}

function UTF8_Blob_toString(source,     // @arg Blob|null - UTF8 binary
                            callback) { // @arg Function|null - callback(result:String):void
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(source,   "Blob|omit"),     UTF8_Blob_toString, "source");
        $valid($type(callback, "Function|omit"), UTF8_Blob_toString, "callback");
    }
//}@dev

    var reader = new FileReader();

    reader["onloadend"] = function(event) {
        callback(event.target.result);
    };
    reader["readAsText"](source);
}

function UTF8_fromString(source) { // @arg String
                                   // @ret UTF8String
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(source, "String"), UTF8_fromString, "source");
    }
//}@dev

    return unescape( encodeURIComponent(source) );
}

function UTF8_toString(source) { // @arg UTF8String|null
                                 // @ret String
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(source, "String|omit"), UTF8_toString, "source");
    }
//}@dev

    return decodeURIComponent( escape(source || "") );
}

function UTF8_encode(source) { // @arg Uint8Array|Uint16Array|Uint32Array|String - Unicode values.
                               // @ret Uint8Array - UTF8 values
                               // @desc convert Unicode to Uint8Array.
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(source, "Uint8Array|Uint16Array|Uint32Array|String"), UTF8_encode, "source");
    }
//}@dev

    var isString = typeof source === "string";
    var result = [], i = 0, iz = source.length, d = 0, u = 0;

    while (i < iz) {
        var c = source[i++];
        if (isString) {
            c = c.charCodeAt(0);
        }
        if (c <= 0x7F) { // [1]
            // 00000000 0zzzzzzz
            result.push(c);                                   // 0zzz zzzz (1st)
        } else if (c <= 0x07FF) { // [2]
            // 00000yyy yyzzzzzz
            result.push(c >>>  6 & 0x1f | 0xc0,               // 110y yyyy (1st)
                        c        & 0x3f | 0x80);              // 10zz zzzz (2nd)
        } else if (c <= 0xFFFF) { // [3] or [5]
            if (c >= 0xD800 && c <= 0xDBFF) { // [5] Surrogate Pairs
                // 110110UU UUwwwwxx 110111yy yyzzzzzz
                d = source[i++];
                u = (c >>> 6 & 0x0f) + 1; // 0xUUUU+1 -> 0xuuuuu
                result.push(
                     u >>>  2 & 0x07 | 0xf0,                  // 1111 0uuu (1st)
                    (u <<   4 & 0x30 | 0x80) | c >>> 2 & 0xf, // 10uu wwww (2nd)
                    (c <<   4 & 0x30 | 0x80) | d >>> 6 & 0xf, // 10xx yyyy (3rd)
                     d        & 0x3f | 0x80);                 // 10zz zzzz (4th)
            } else {
                // xxxxyyyy yyzzzzzz
                result.push(c >>> 12 & 0x0f | 0xe0,           // 1110 xxxx (1st)
                            c >>>  6 & 0x3f | 0x80,           // 10yy yyyy (2nd)
                            c        & 0x3f | 0x80);          // 10zz zzzz (3rd)
            }
        } else if (c <= 0x10FFFF) { // [4]
            // 000wwwxx xxxxyyyy yyzzzzzz
            result.push(c >>> 18 & 0x07 | 0xf0,               // 1111 0www (1st)
                        c >>> 12 & 0x3f | 0x80,               // 10xx xxxx (2nd)
                        c >>>  6 & 0x3f | 0x80,               // 10yy yyyy (3rd)
                        c        & 0x3f | 0x80);              // 10zz zzzz (4th)
        }
    }
    return new Uint8Array(result);
}

function UTF8_decode(source,     // @arg Uint8Array
                     toString) { // @arg Boolean = false
                                 // @ret Uint32Array|String
                                 // @desc convert Uint8Array to Uint32Array|String.
//{@dev
    if (!global["BENCHMARK"]) {
        $valid($type(source,   "Uint8Array"),   UTF8_decode, "source");
        $valid($type(toString, "Boolean|omit"), UTF8_decode, "toString");
    }
//}@dev

    var result = [], i = 0, iz = source.length;
    var c = 0, d = 0, e = 0, f = 0;
    var u = 0, w = 0, x = 0, y = 0, z = 0;

    while (i < iz) {
        c = source[i++];
        if (c < 0x80) {         // [1] 0x00 - 0x7F (1 byte)
            result.push(c);
        } else if (c < 0xE0) {  // [2] 0xC2 - 0xDF (2 byte)
            d = source[i++];
            result.push( (c & 0x1F) <<  6 | d & 0x3F );
        } else if (c < 0xF0) {  // [3] 0xE0 - 0xE1, 0xEE - 0xEF (3 bytes)
            d = source[i++];
            e = source[i++];
            result.push( (c & 0x0F) << 12 | (d & 0x3F) <<  6 | e & 0x3F );
        } else if (c < 0xF5) {  // [4] 0xF0 - 0xF4 (4 bytes)
            d = source[i++];
            e = source[i++];
            f = source[i++];
            u = (((c & 0x07) << 2) | ((d >> 4) & 0x03)) - 1;
            w = d & 0x0F;
            x = (e >> 4) & 0x03;
            z = f & 0x3F;
            result.push( 0xD8 | (u << 6) | (w << 2) | x,
                         0xDC | (y << 4) | z );
        }
    }
    if (toString) {
        return TypedArrayToString(result);
    }
    return new Uint32Array(result);
}

function TypedArrayToString(source) { // @arg TypedArray|Array
                                      // @ret BinaryString
    var result = [], i = 0, iz = source.length, bulkSize = 24000;
    var method = Array.isArray(source) ? "slice" : "subarray";

    // avoid String.fromCharCode.apply(null, BigArray) exception.
    if (iz < bulkSize) {
        return String.fromCharCode.apply(null, source);
    }
    for (; i < iz; i += bulkSize) {
        result.push( String.fromCharCode.apply(null, source[method](i, i + bulkSize)) );
    }
    return result.join("");
}

return UTF8; // return entity

});

