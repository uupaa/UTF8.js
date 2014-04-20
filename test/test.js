new Test().add([
        testUTF8EncodeAndDecode,
        testUTF8FromAndToString,
        testUTF8EncodeAndDecodeTypedArray,
    ]).run(function(err, test) {
        if (1) {
            err || test.worker(function(err, test) {
                if (!err && typeof UTF8_ !== "undefined") {
                    var name = Test.swap(UTF8, UTF8_);

                    new Test(test).run(function(err, test) {
                        Test.undo(name);
                    });
                }
            });
        }
    });

function testUTF8EncodeAndDecode(next) {

    var source = "\u3042\u3044\u3046\u3048\u304a"; // <japanese> A I U E O </japanese>
    var utf8Array = UTF8.encode( WordArray.fromString(source) );
    var revert = WordArray.toString( UTF8.decode(utf8Array) );

    if (source === revert) {
        console.log("testUTF8EncodeAndDecode ok");
        next && next.pass();
    } else {
        console.log("testUTF8EncodeAndDecode ng");
        next && next.miss();
    }
}

function testUTF8FromAndToString(next) {

    var source = "\u3042\u3044\u3046\u3048\u304a"; // <japanese> A I U E O </japanese>
    var utf8OctetString = UTF8.fromString(source);
    var revert = UTF8.toString(utf8OctetString);

    if (source === revert) {
        console.log("testUTF8FromAndToString ok");
        next && next.pass();
    } else {
        console.log("testUTF8FromAndToString ng");
        next && next.miss();
    }
}

function testUTF8EncodeAndDecodeTypedArray(next) {

    var source = "\u3042\u3044\u3046\u3048\u304a"; // <japanese> A I U E O </japanese>
    var uint8Array = UTF8.encode( new Uint32Array( WordArray.fromString(source) ) );
    var revert = WordArray.toString( Array.prototype.slice.call( UTF8.decode(uint8Array) ) );

    if (source === revert) {
        console.log("testUTF8EncodeAndDecodeTypedArray ok");
        next && next.pass();
    } else {
        console.log("testUTF8EncodeAndDecodeTypedArray ng");
        next && next.miss();
    }
}
