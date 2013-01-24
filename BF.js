/* bitfactory / BF.js
 * Lightweight JavaScript make.
 * (c) 2013 David (daXXog) Volm ><> + + + <><
 * Released under Apache License, Version 2.0:
 * http://www.apache.org/licenses/LICENSE-2.0.html  
 */

/* UMD LOADER: https://github.com/umdjs/umd/blob/master/returnExports.js */
(function (root, factory) {
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
  }
}(this, function() {
    var path = require('path'),
        async = require('async');
    
    var BF = {};
    
    BF.make = function(obj, deps) {
        var call = process.argv[2];
        
        if(typeof call == 'undefined') {
            call = '';
        }
        
        if(call === 'deploy') { //slingshot-like deployment
            process.chdir(path.dirname(process.argv[1]));
        }
        
        if(typeof obj[call] == 'function') { //if we have a route
            if((typeof deps == 'object') && ((typeof deps[call] == 'object') || (typeof deps['*'] == 'object'))) { //if we have a dependency somewhere
                if((typeof deps[call] == 'object') && (typeof deps['*'] == 'object')) { //if we have a wildcard and a normal dependency
                    async.auto(deps['*'], function(err, results) { //run the wildcard dependency with async.auto
                        if(!err) { //if we did NOT have an error
                            async.auto(deps[call], function(err, _results) { //run the normal dependency with async.auto
                                obj[call](err, [results, _results]); //call the route
                            });
                        } else {
                            obj[call](err); //call the route, passing the error we found
                        }
                    });
                } else if(typeof deps['*'] == 'object') { //if we have ONLY a wildcard dependency
                    async.auto(deps['*'], function(err, results) { //run it with async.auto
                        obj[call](err, [results, null]); //call the route
                    });
                } else if(typeof deps[call] == 'object') { //if we have ONLY a normal dependency
                    async.auto(deps[call], function(err, results) { //run it with async.auto
                        obj[call](err, [null, results]); //call the route
                    });
                }
            } else {
                obj[call](); //call the route
            }
        }
    };
    
    return BF;
}));