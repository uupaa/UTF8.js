var ModuleTestUTF8 = (function(global) {

//var _runOnNode = "process" in global;
//var _runOnWorker = "WorkerLocation" in global;
//var _runOnBrowser = "document" in global;

return new Test("UTF8", {
        disable:    false,
        browser:    true,
        worker:     true,
        node:       true,
        button:     true,
        both:       true,
    }).add([
        testUTF8EncodeAndDecode,
        testUTF8FromAndToString,
        testUTF8EncodeAndDecodeTypedArray,
    ]).run().clone();

function testUTF8EncodeAndDecode(next) {

    var source = "\u3042\u3044\u3046\u3048\u304a"; // <japanese> A I U E O </japanese>
  //var utf8Array = UTF8.encode( WordArray.fromString(source) );
    var utf8Array = UTF8.encode( DataType["Array"].fromString(source, 2) );
  //var revert = WordArray.toString( UTF8.decode(utf8Array) );
    var revert = DataType["Array"].toString( UTF8.decode(utf8Array) );

    if (source === revert) {
        next && next.pass();
    } else {
        next && next.miss();
    }
}

function testUTF8FromAndToString(next) {

    var source = "\u3042\u3044\u3046\u3048\u304a"; // <japanese> A I U E O </japanese>
    var utf8OctetString = UTF8.fromString(source);
    var revert = UTF8.toString(utf8OctetString);

    if (source === revert) {
        next && next.pass();
    } else {
        next && next.miss();
    }
}

function testUTF8EncodeAndDecodeTypedArray(next) {

    var source = "\u3042\u3044\u3046\u3048\u304a"; // <japanese> A I U E O </japanese>
  //var uint8Array = UTF8.encode( new Uint32Array( WordArray.fromString(source) ) );
    var uint8Array = UTF8.encode( new Uint32Array( DataType["Array"].fromString(source, 2) ) );
  //var revert = WordArray.toString( Array.prototype.slice.call( UTF8.decode(uint8Array) ) );
    var revert = DataType["Array"].toString( Array.prototype.slice.call( UTF8.decode(uint8Array) ) );

    if (source === revert) {
        next && next.pass();
    } else {
        next && next.miss();
    }
}

})((this || 0).self || global);

