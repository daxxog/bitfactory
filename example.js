/* bitfactory / example.js
 * bitfactory example
 * (c) 2013 David (daXXog) Volm ><> + + + <><
 * Released under Apache License, Version 2.0:
 * http://www.apache.org/licenses/LICENSE-2.0.html  
 */

var ms; //counter for timing stuff

require('./BF').make({ //routes
    "": function(err, results) {
        console.log('normal make!');
    },
    "deploy": function(err, results) {
        console.log('deployment make!');
    },
    "custom": function(err, results) {
        console.log('custom make!');
    }
}, { //dependencies
    "*": { //wildcard
        "common": function(cb) {
            console.log('did common dependecy');
            cb();
        },
        "common2": function(cb) {
            console.log('did another common dependecy');
            cb();
        },
    },
    "": {
        "1": function(cb) {
            console.log('::dep 1');
            cb();
        }
    },
    "deploy": {
        "1": function(cb) {
            ms = +new Date();
            console.log('deploy::dep 1');
            setTimeout(cb, 200);
        },
        "2": function(cb) {
            console.log('deploy::dep 2');
            setTimeout(cb, 100);
        },
        "3": ['1', '2', function(cb) { //3 depends on 1 and 2
            console.log('deploy::dep 3');
            var _ms = +new Date();
            console.log('1 and 2 took: ' + (_ms - ms) + 'ms'); //should take ~200ms, the timeout of 1
            cb();
        }],
        "4": function(cb) {
            console.log('deploy::dep 4');
            cb();
        }
    }
});