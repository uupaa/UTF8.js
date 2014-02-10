new Test().add([
        testUTF8EncodeDecode,
    ]).run().worker(function(err, test) {
        if (!err) {
            var undo = Test.swap(UTF8, UTF8_);

            new Test(test).run(function(err, test) {
                undo = Test.undo(undo);
            });
        }
    });

function testUTF8EncodeDecode(next) {

    var source = "\u3042\u3044\u3046\u3048\u304a"; // <japanese> A I U E O </japanese>
    var utf8Array = UTF8.encode( WordArray.fromString(source) );
    var revert = WordArray.toString( UTF8.decode(utf8Array) );

    if (source === revert) {
        console.log("testUTF8EncodeDecode ok");
        next && next.pass();
    } else {
        console.log("testUTF8EncodeDecode ng");
        next && next.miss();
    }
}

