(function(global) {

// --- define ----------------------------------------------

// --- variable --------------------------------------------
// --- interface -------------------------------------------
function UnitTest(items) { // @arg Array/Object(= null): { name: fn, ... }
    this._items = {}; // { name: fn }
    items && this.add(items);
}
UnitTest.prototype.add = Test_add;     // UnitTest#add(items:Object):void
UnitTest.prototype.set = Test_set;     // UnitTest#set(name:String, result:Mix):void
UnitTest.prototype.run = Test_run;     // UnitTest#run():void
// --- collections ---
UnitTest.prototype.names = Test_names; // UnitTest#names():Array
UnitTest.prototype.functions = Test_functions; // UnitTest#functions():Array

// --- implement -------------------------------------------
function Test_add(items) { // @arg Function/Array/Object: items. { name: fn, ... }
    if (typeof items === "function") {
        this._items[items.name] = { fn: items, result: null };
    } else if (Array.isArray(items)) {
        for (var i = 0, iz = items.length; i < iz; ++i) {
            this._items[items[i].name] = { fn: items[i], result: null };
        }
    } else {
        for (var name in items) {
            this._items[name] = { fn: items[name], result: null };
        }
    }
}

function Test_set(name,     // @arg String: item name.
                  result) { // @arg Mix: result value.
                            // @throw:
    if (name in this._items[name]) {
        this._items[name].result = result;
    } else {
        throw new Error(name + " is not found");
    }
}

function Test_get(name) { // @arg String(= ""): "" is all
                          // @ret Object: { name: result, ... }
    var result = {};

    if (name) {
        result[name] = this._items[name].result;
    } else {
        for (var name in this._items) {
            result[name] = this._items[name].result; // create { name: result, ... }
        }
    }
    return result;
}

function Test_names() { // @ret Array: [name, ...]
    return Object.keys(this._items);
}

function Test_functions() { // @ret Array: [fn, ...]
    var that = this;

    return this.names().map(function(name) {
                return that._items[name].fn;
            });
}

function Test_run(finished) { // @are Function(= null):
    function callback(err, args, values) {
        if (err) {
            console.log("test fail.");
        } else {
            console.log("test success.");
        }
        finished && finished(err);
    }

    var fns = this.functions();
    var taskRunner = new Task(fns.length, callback, null, _next);//.missable(fns.length);

    _next();

    function _next() {
        var fn = fns.shift();

        fn && fn(taskRunner); // call user function.
                              // function fn(taskRunner) { taskRunner.pass(); }
    }
}

// --- export ----------------------------------------------
if (global.process) { // node.js
    module.exports = UnitTest;
}
global.UnitTest = UnitTest;

})(this.self || global);

