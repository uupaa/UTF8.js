var ModuleTestUTF8 = (function(global) {

global["BENCHMARK"] = false;

var test = new Test("UTF8", {
        disable:    false, // disable all tests.
        browser:    true,  // enable browser test.
        worker:     true,  // enable worker test.
        node:       true,  // enable node test.
        nw:         true,  // enable nw.js test.
        button:     true,  // show button.
        both:       true,  // test the primary and secondary modules.
        ignoreError:false, // ignore error.
        callback:   function() {
        },
        errorback:  function(error) {
        }
    }).add([
        testUTF8_from_to_string,
        testUTF8_encode_and_decode,
    ]);

if (IN_BROWSER || IN_NW) {
    test.add([
        testUTF8_Blob_fromString,
    ]);
} else if (IN_WORKER) {
    test.add([
        testUTF8_Blob_fromString,
    ]);
} else if (IN_NODE) {
    test.add([
        // node.js and io.js test
    ]);
}

// --- test cases ------------------------------------------
function testUTF8_from_to_string(test, pass, miss) {

    var source = "\u3042\u3044\u3046\u3048\u304a"; // <japanese> A I U E O </japanese>
    var utf8   = UTF8.fromString(source);
    var result = UTF8.toString(utf8);

    if (source === result) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testUTF8_encode_and_decode(test, pass, miss) {

    var source = [0x3042, 0x3044, 0x3046, 0x3048, 0x304a]; // <japanese> A I U E O </japanese>
    var cases = {
            "fromUint32": UTF8.encode( new Uint32Array(source) ),
            "fromUint16": UTF8.encode( new Uint16Array(source) ),
            "fromUint8":  UTF8.encode( new Uint8Array(source) ),
            "fromString": UTF8.encode( String.fromCharCode.apply(null, source) ),
        };
    var result = {
            "fromUint32": UTF8.decode(cases.fromUint32, true),
            "fromUint16": UTF8.decode(cases.fromUint16, true),
            "fromUint8":  UTF8.decode(cases.fromUint8,  true),
            "fromString": UTF8.decode(cases.fromString, true),
        };
    var verify = {
        "1": String.fromCharCode.apply(null, source) === result.fromUint32,
        "2": String.fromCharCode.apply(null, source) === result.fromUint16,
        "3": String.fromCharCode.apply(null, cases.fromUint8)  === result.fromUint8,
        "4": String.fromCharCode.apply(null, source) === result.fromString,
    };

    var judge = JSON.stringify(verify, null, 2);
    console.log(judge);

    if (/false/.test(judge)) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testUTF8_Blob_fromString(test, pass, miss) {
    var blob = UTF8.Blob.fromString("あいう"); // to UTF8 blob

    var reader = new FileReader();
    reader.onloadend = function(event) {
        var u8 = new Uint8Array(event.target.result);
        console.log( u8 ); // [227, 129, 130,  227, 129, 132,  227, 129, 134]
        console.log( UTF8.decode(u8, true) ); // "あいう"
    };
    reader.readAsArrayBuffer(blob);


    UTF8.Blob.toString(blob, function(result) {
        if (result === "あいう") {
            test.done(pass());
        } else {
            test.done(miss());
        }
    });
}

return test.run();

})(GLOBAL);

