[bitfactory](https://github.com/daxxog/bitfactory)
==========

Lightweight JavaScript make.

Install
-------
stable
```bash
npm install bitfactory
```

edge
```bash
npm install https://github.com/daxxog/bitfactory/tarball/master
```

Example (basic)
---------

make.js file:
```javascript
//make.js
require('bitfactory').make({ //routes
    "": function(err, results) {
        console.log('normal make!');
    }
});
```

Running
```bash
node make
```

Example (advanced)
---------

make.js file:
```javascript
//make.js
var ms; //counter for timing stuff

require('bitfactory').make({ //routes
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
```

Running
```bash
node make
node make deploy
node make custom
```
