const ffi = require('ffi-napi');
const ref = require('ref-napi');
const struct = require('ref-struct-di');
const array = require('ref-array-napi');
const finalize = require('finalize');


console.log("https://github.com/redredgroovy/go-ffi-demo")

console.log("ffi", ffi);
console.log("ref", ref);
console.log("struct", struct);
console.log("array", array);
console.log("finalize", finalize);