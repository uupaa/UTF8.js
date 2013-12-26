// @name: UTF8.js

(function(global) {

// --- define ----------------------------------------------
// --- variable --------------------------------------------
// --- interface -------------------------------------------
function UTF8() { // @help: UTF8
                  // @desc: Convert UTF16(JavaScript String) <-> UTF8
}
UTF8.name = "UTF8";
UTF8.repository = "https://github.com/uupaa/UTF8.js";
UTF8.encode = UTF8_encode;  // UTF8.encode(source:UTF16Array):UTF8Array
UTF8.decode = UTF8_decode;  // UTF8.decode(source:UTF8Array):UTF16Array

// --- implement -------------------------------------------
function UTF8_encode(source) { // @arg UTF16Array:
                               // @ret UTF8Array:
                               // @help: UTF8.encode
                               // @desc: Convert UTF16 to UTF8.
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
    return rv;
}

function UTF8_decode(source) { // @arg UTF8Array
                               // @ret UTF16Array:
                               // @help: UTF8.decode
                               // @desc: convert UTF8 to UTF16.
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
    return rv;
}

// --- export ----------------------------------------------
if (global.process) { // node.js
    module.exports = UTF8;
}
global.UTF8 = UTF8;

})(this.self || global);

